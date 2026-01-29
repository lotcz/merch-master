import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {DesignPayload} from "../../types/Design";
import {PrintTypePayload, PrintTypeStub} from "../../types/PrintType";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import {Product} from "../../types/Product";
import {EntityWithNameIdSelect} from "zavadil-react-common";
import {ProductColorStub} from "../../types/ProductColor";
import DesignerPrintZone from "./DesignerPrintZone";
import ColorSelectId from "../productColor/ColorSelectId";
import {DesignFileStub} from "../../types/DesignFile";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 350;

export type DesignerParams = {
	uuid?: string | null;
	onFinished: (uuid: string) => any;
}

export default function Designer({uuid, onFinished}: DesignerParams) {
	const areaRef = useRef<HTMLDivElement>(null);
	const [areaWidth, setAreaWidth] = useState<number>(MAX_WIDTH);
	const [areaHeight, setAreaHeight] = useState<number>(MAX_HEIGHT);

	const updateAreaSize = useCallback(
		() => {
			if (!areaRef.current) return;
			setAreaWidth(areaRef.current.clientWidth);
			setAreaHeight(areaRef.current.clientHeight);
		},
		[areaRef]
	);

	useEffect(updateAreaSize, []);

	const [design, setDesign] = useState<DesignPayload>();
	const [products, setProducts] = useState<Array<Product>>();
	const [selectedProductId, setSelectedProductId] = useState<number | null | undefined>();
	const [printTypes, setPrintTypes] = useState<Array<PrintTypeStub>>();
	const [selectedPrintTypeId, setSelectedPrintTypeId] = useState<number | null | undefined>();
	const [printType, setPrintType] = useState<PrintTypePayload | null | undefined>();
	const [colors, setColors] = useState<Array<ProductColorStub>>();
	const [selectedColorId, setSelectedColorId] = useState<number | null | undefined>();
	const [selectedFile, setSelectedFile] = useState<DesignFileStub | undefined>();

	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const [error, setError] = useState<string>();

	const client = useMemo(() => new DesignerRestClient(), []);

	const loadProducts = useCallback(
		() => {
			client
				.loadProducts()
				.then(setProducts)
				.catch((e: Error) => setError(e.message))
		},
		[client]
	);

	useEffect(loadProducts, []);

	const updatePrintTypeValue = useCallback(
		() => {
			if (printTypes && printTypes.length > 0) {
				if (NumberUtil.isEmpty(selectedPrintTypeId) || !printTypes.find(o => o.id === selectedPrintTypeId)) {
					setSelectedPrintTypeId(printTypes[0].id);
				}
			}
		},
		[printTypes, selectedPrintTypeId]
	);

	useEffect(updatePrintTypeValue, [printTypes, selectedPrintTypeId]);

	const updateColorValue = useCallback(
		() => {
			if (colors && colors.length > 0) {
				if (NumberUtil.isEmpty(selectedColorId) || !colors.find(o => o.id === selectedColorId)) {
					setSelectedColorId(colors[0].id);
				}
			}
		},
		[colors, selectedColorId]
	);

	useEffect(updateColorValue, [colors, selectedColorId]);

	const loadPrintTypes = useCallback(
		() => {
			if (!selectedProductId) {
				setPrintTypes(undefined);
				return;
			}
			client
				.loadPrintTypesByProduct(selectedProductId)
				.then(setPrintTypes)
				.catch((e: Error) => setError(e.message))
		},
		[client, selectedProductId]
	);

	useEffect(loadPrintTypes, [selectedProductId]);

	const loadColors = useCallback(
		() => {
			if (!selectedProductId) {
				setColors(undefined);
				return;
			}
			client
				.loadColorsByProduct(selectedProductId)
				.then(setColors)
				.catch((e: Error) => setError(e.message))
		},
		[client, selectedProductId]
	);

	useEffect(loadColors, [selectedProductId]);

	const loadPrintType = useCallback(
		() => {
			if (!selectedPrintTypeId) {
				setPrintType(undefined);
				return;
			}
			client
				.loadPrintType(selectedPrintTypeId)
				.then(
					(pt) => {
						setPrintType(pt);
						if (pt.printType.productId !== selectedProductId) {
							setSelectedProductId(pt.printType.productId);
						}
					}
				)
				.catch((e: Error) => setError(e.message))
		},
		[client, selectedPrintTypeId, selectedProductId]
	);

	useEffect(loadPrintType, [selectedPrintTypeId]);

	const onChanged = useCallback(
		(newDesign?: DesignPayload) => {
			if (!design) return;
			setDesign(newDesign || {...design});
			setChanged(true);
		},
		[design]
	);

	const updatePrintType = useCallback(
		() => {
			if (!design) return;
			design.design.printTypeId = selectedPrintTypeId;
			onChanged();
		},
		[design, selectedPrintTypeId, onChanged]
	);

	useEffect(updatePrintType, [selectedPrintTypeId]);

	const updateColor = useCallback(
		() => {
			if (!design) return;
			design.design.productColorId = selectedColorId;
			onChanged();
		},
		[design, selectedColorId, onChanged]
	);

	useEffect(updateColor, [selectedColorId]);

	const loadDesign = useCallback(
		() => {
			if (!uuid) {
				setDesign({
					design: {
						confirmed: false
					},
					files: []
				});
				setSelectedColorId(undefined);
				setSelectedPrintTypeId(undefined);
				setSelectedFile(undefined);
				return;
			}
			client.loadDesign(uuid)
				.then(
					(d) => {
						setDesign(d);
						setSelectedColorId(d.design.productColorId);
						setSelectedPrintTypeId(d.design.printTypeId);
						setSelectedFile(undefined);
					})
				.catch((e: Error) => setError(e.message))
		},
		[uuid, client]
	);

	useEffect(loadDesign, [uuid]);

	const saveDesign = useCallback(
		(finished: boolean) => {
			if (!design) return;

			if (finished && !design.design.confirmed) design.design.confirmed = true;
			setSaving(true);

			client
				.saveDesign(design)
				.then(
					(d) => {
						if (finished) {
							if (StringUtil.isBlank(design.design.uuid)) {
								setError("No UUID assigned!");
							} else {
								onFinished(design.design.uuid);
							}
						} else {
							setDesign(d);
						}
						setChanged(false);
					})
				.catch((e: Error) => setError(e.message))
				.finally(() => setSaving(false))
		},
		[client, design, onFinished]
	);

	if (!design) {
		return <Spinner/>
	}

	return (
		<Container fluid className="designer">
			<Row>
				<Col md={3} lg={2}>
					<Form.Group>
						<Form.Label title="Produkt">Produkt</Form.Label>
						{
							selectedProductId && <EntityWithNameIdSelect
								id={selectedProductId}
								onChange={setSelectedProductId}
								options={products}
							/>
						}
					</Form.Group>
					<Form.Group>
						<Form.Label title="Barva">Barva</Form.Label>
						{
							selectedColorId && <ColorSelectId
								id={selectedColorId}
								onSelected={setSelectedColorId}
								colors={colors}
							/>
						}
					</Form.Group>
					<Form.Group>
						<Form.Label title="Druh potisku">Druh potisku</Form.Label>
						{
							selectedPrintTypeId && <EntityWithNameIdSelect
								id={selectedPrintTypeId}
								onChange={setSelectedPrintTypeId}
								options={printTypes}
							/>
						}
					</Form.Group>
					<Form.Group>
						<Form.Label title="Náhled">Náhled</Form.Label>
						<div>preview</div>
					</Form.Group>
				</Col>
				<Col md={9} lg={10}>
					<div ref={areaRef}>
						{
							printType ? printType.zones.map(
								(zone) => <DesignerPrintZone
									printZone={zone}
									design={design}
									onChanged={onChanged}
									maxWidth={areaWidth}
									maxHeight={MAX_HEIGHT}
									selectedFile={selectedFile}
									onFileSelected={setSelectedFile}
								/>
							) : <Spinner/>
						}
					</div>
				</Col>
			</Row>
			{
				error && <Row>
					<Col md={12}>
						<Alert variant="danger">{error}</Alert>
					</Col>
				</Row>
			}
			<Row>
				<Col md={{span: 6, offset: 3}} className="text-center">
					<Button size="lg" onClick={() => saveDesign(true)}>Uložit</Button>
				</Col>
			</Row>
		</Container>
	)
}
