import {Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {StringUtil} from "zavadil-ts-common";
import {DesignPayload} from "../../types/Design";
import {PrintTypePayload, PrintTypeStub} from "../../types/PrintType";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import {Product} from "../../types/Product";
import {EntityWithNameIdSelect} from "zavadil-react-common";
import {ProductColorStub} from "../../types/ProductColor";
import DesignerPrintZone from "./DesignerPrintZone";
import ColorSelectId from "../productColor/ColorSelectId";

export type DesignerParams = {
	uuid?: string | null;
	onFinished: (uuid: string) => any;
}

export default function Designer({uuid, onFinished}: DesignerParams) {
	const [error, setError] = useState<string>();
	const [design, setDesign] = useState<DesignPayload>();
	const [products, setProducts] = useState<Array<Product>>();
	const [selectedProductId, setSelectedProductId] = useState<number | null | undefined>();
	const [printTypes, setPrintTypes] = useState<Array<PrintTypeStub>>();
	const [selectedPrintTypeId, setSelectedPrintTypeId] = useState<number | null | undefined>();
	const [printType, setPrintType] = useState<PrintTypePayload | null | undefined>();
	const [colors, setColors] = useState<Array<ProductColorStub>>();
	const [selectedColorId, setSelectedColorId] = useState<number | null | undefined>();
	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

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

	const loadPrintTypes = useCallback(
		() => {
			if (!selectedProductId) {
				setSelectedPrintTypeId(undefined);
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
				setSelectedColorId(undefined);
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
		() => {
			if (!design) return;
			setDesign({...design});
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
				return;
			}
			client.loadDesign(uuid)
				.then(
					(d) => {
						setDesign(d);
						setSelectedColorId(d.design.productColorId);
						setSelectedPrintTypeId(d.design.printTypeId);
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
						<EntityWithNameIdSelect
							id={selectedProductId}
							onChange={setSelectedProductId}
							options={products}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label title="Barva">Barva</Form.Label>
						<ColorSelectId
							id={selectedColorId}
							onSelected={setSelectedColorId}
							colors={colors}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label title="Druh potisku">Druh potisku</Form.Label>
						<EntityWithNameIdSelect
							id={selectedPrintTypeId}
							onChange={setSelectedPrintTypeId}
							options={printTypes}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label title="Náhled">Náhled</Form.Label>
						<div>preview</div>
					</Form.Group>
				</Col>
				<Col md={9} lg={10}>
					{
						printType ? printType.zones.map(
							(zone) => <DesignerPrintZone printZone={zone} design={design} onChanged={onChanged}/>
						) : <Spinner/>
					}
				</Col>
			</Row>
			<Row>
				<Col>
					<Button onClick={() => saveDesign(true)}>Save</Button>
				</Col>
			</Row>
		</Container>
	)
}
