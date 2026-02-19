import {Form, Spinner} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {PrintTypeStub} from "../../../types/PrintType";
import {DesignerRestClientContext} from "../../../client/designer/DesignerRestClient";
import {Product} from "../../../types/Product";
import {EntityWithNameIdSelect} from "zavadil-react-common";
import {ProductColorStub} from "../../../types/ProductColor";
import ColorSelectId from "../../productColor/ColorSelectId";
import {DesignFileStub} from "../../../types/DesignFile";
import {PrintZoneStub} from "../../../types/PrintZone";
import {PIXEL_PER_MM} from "../../../util/ImageUtil";
import {DesignPayload} from "../../../types/Design";
import DesignerMenuFile from "./DesignerMenuFile";

export type DesignerMenuParams = {
	productId: number;
	design: DesignPayload;
	readOnly: boolean;
	admin: boolean;
	selectedFile?: DesignFileStub;
	selectedZone?: PrintZoneStub;
	onChange: (design: DesignPayload) => any;
	onUpdateFile: (file: DesignFileStub) => any;
	onFileSelected: (selectedFile?: DesignFileStub) => any;
	onError: (error: string) => any;
}

export default function DesignerMenu({
	productId,
	design,
	readOnly,
	admin,
	selectedFile,
	selectedZone,
	onUpdateFile,
	onChange,
	onFileSelected,
	onError
}: DesignerMenuParams) {
	const client = useContext(DesignerRestClientContext);
	const [product, setProduct] = useState<Product>();

	const loadProduct = useCallback(
		() => {
			client
				.loadProduct(productId)
				.then(setProduct)
				.catch((e: Error) => onError(e.message))
		},
		[client, productId, onError]
	);

	useEffect(loadProduct, [productId]);

	const [printTypes, setPrintTypes] = useState<Array<PrintTypeStub>>();

	const loadPrintTypes = useCallback(
		() => {
			client
				.loadPrintTypesByProduct(productId)
				.then(setPrintTypes)
				.catch((e: Error) => onError(e.message))
		},
		[client, productId, onError]
	);

	useEffect(loadPrintTypes, [productId]);

	const [colors, setColors] = useState<Array<ProductColorStub>>();

	const loadColors = useCallback(
		() => {
			client
				.loadColorsByProduct(productId)
				.then(setColors)
				.catch((e: Error) => onError(e.message))
		},
		[client, productId, onError]
	);

	useEffect(loadColors, [productId]);

	const scale = useMemo(
		() => {
			if (selectedFile === undefined || selectedZone === undefined) return 0;
			return (selectedFile.imageWidthMm * PIXEL_PER_MM) / selectedFile.originalImageWidthPx;
		},
		[selectedFile, selectedZone]
	);

	const setScale = useCallback(
		(scale: number) => {
			if (!selectedFile) return;
			selectedFile.imageWidthMm = scale * selectedFile.originalImageWidthPx / PIXEL_PER_MM;
			selectedFile.imageHeightMm = scale * selectedFile.originalImageHeightPx / PIXEL_PER_MM;
			onUpdateFile(selectedFile);
		},
		[selectedFile, onUpdateFile]
	);

	const onColorChange = useCallback(
		(colorId: number) => {
			design.design.productColorId = colorId;
			onChange({...design});
		},
		[design, onChange]
	);

	const onPrintTypeChange = useCallback(
		(printTypeId: number) => {
			design.design.printTypeId = printTypeId;
			onChange({...design});
		},
		[design, onChange]
	);

	return (
		<Form>
			<Form.Group>
				<Form.Label title="Produkt">Produkt</Form.Label>
				<div>
					{
						product ? <strong>{product.name}</strong>
							: <Spinner size="sm"/>
					}
				</div>
			</Form.Group>
			<Form.Group>
				<Form.Label title="Barva">Barva</Form.Label>
				{
					colors ? <ColorSelectId
							id={design.design.productColorId}
							colors={colors}
							readOnly={readOnly}
							onSelected={onColorChange}
						/>
						: <Spinner/>
				}
			</Form.Group>
			<Form.Group>
				<Form.Label title="Druh potisku">Druh potisku</Form.Label>
				{
					printTypes ? <EntityWithNameIdSelect
							id={design.design.printTypeId}
							disabled={readOnly}
							onChange={
								(printTypeId) => {
									if (printTypeId) onPrintTypeChange(printTypeId);
								}
							}
							options={printTypes}
						/>
						: <Spinner/>
				}
			</Form.Group>
			{
				product && selectedFile && selectedZone && <DesignerMenuFile
					product={product}
					design={design}
					readOnly={readOnly}
					admin={admin}
					selectedFile={selectedFile}
					selectedZone={selectedZone}
					onUpdateFile={onUpdateFile}
					onFileDeleted={
						() => {
							onChange({design: design.design, files: design.files.filter(f => f !== selectedFile)});
							onFileSelected(undefined);
						}
					}
					onError={onError}
				/>
			}
		</Form>

	)
}
