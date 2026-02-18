import {Button, Form, Spinner, Stack} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {PrintTypeStub} from "../../types/PrintType";
import {DesignerRestClientContext} from "../../client/designer/DesignerRestClient";
import {Product} from "../../types/Product";
import {EntityWithNameIdSelect, IconButton} from "zavadil-react-common";
import {ProductColorStub} from "../../types/ProductColor";
import ColorSelectId from "../productColor/ColorSelectId";
import {DesignFileStub} from "../../types/DesignFile";
import ResetableRange from "../general/ResetableRange";
import {PrintZoneStub} from "../../types/PrintZone";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";
import {DesignPayload} from "../../types/Design";
import {BsTrash} from "react-icons/bs";
import {BiRotateLeft, BiRotateRight} from "react-icons/bi";

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
				selectedFile && selectedZone && <Form>
					<hr/>
					<div className="d-flex align-items-center justify-content-between">
						<strong className="text-truncate">{selectedFile.originalImageName}</strong>
						<IconButton
							variant="danger"
							icon={<BsTrash/>}
							onClick={
								() => {
									onChange({design: design.design, files: design.files.filter(f => f !== selectedFile)});
									onFileSelected(undefined);
								}
							}
						/>
					</div>

					<ResetableRange
						label={`Velikost (${Math.round(scale * 100)}%)`}
						defaultValue={1}
						value={scale}
						min={0.01}
						max={2}
						step={0.01}
						onChange={setScale}
					/>

					<Stack className="mt-2" direction="horizontal" gap={2}>
						<Button
							variant="primary"
							size="sm"
							onClick={
								() => {
									const scale = ImageUtil.imageFillScale(
										selectedFile.originalImageWidthPx / PIXEL_PER_MM,
										selectedFile.originalImageHeightPx / PIXEL_PER_MM,
										selectedZone.widthMm,
										selectedZone.heightMm
									);
									//setScale(scale);

									const width = scale * selectedFile.originalImageWidthPx / PIXEL_PER_MM;
									const height = scale * selectedFile.originalImageHeightPx / PIXEL_PER_MM;
									selectedFile.imageWidthMm = width;
									selectedFile.imageHeightMm = height;
									selectedFile.positionXMm = (selectedZone.widthMm - width) / 2;
									selectedFile.positionYMm = (selectedZone.heightMm - height) / 2;
									onUpdateFile(selectedFile);
								}
							}>
							Vyplnit
						</Button>
						<Button
							variant="primary"
							size="sm"
							onClick={
								() => {
									const scale = ImageUtil.imageFitScale(
										selectedFile.originalImageWidthPx / PIXEL_PER_MM,
										selectedFile.originalImageHeightPx / PIXEL_PER_MM,
										selectedZone.widthMm,
										selectedZone.heightMm
									);
									//setScale(scale);

									const width = scale * selectedFile.originalImageWidthPx / PIXEL_PER_MM;
									const height = scale * selectedFile.originalImageHeightPx / PIXEL_PER_MM;
									selectedFile.imageWidthMm = width;
									selectedFile.imageHeightMm = height;
									selectedFile.positionXMm = (selectedZone.widthMm - width) / 2;
									selectedFile.positionYMm = (selectedZone.heightMm - height) / 2;
									onUpdateFile(selectedFile);
								}
							}>
							Vycentrovat
						</Button>
					</Stack>

					<ResetableRange
						label={`Rotace (${selectedFile.rotateDeg}°)`}
						defaultValue={0}
						value={selectedFile.rotateDeg}
						min={-180}
						max={180}
						step={0.1}
						onChange={
							(r) => {
								selectedFile.rotateDeg = r;
								onUpdateFile(selectedFile);
							}
						}
					/>

					<Stack className="mt-2" direction="horizontal" gap={2}>
						<IconButton
							variant="primary"
							icon={<BiRotateLeft/>}
							onClick={
								() => {
									let r = selectedFile.rotateDeg - 90;
									if (r < -180) r += 360;
									selectedFile.rotateDeg = r;
									onUpdateFile(selectedFile);
								}
							}
						/>
						<IconButton
							variant="primary"
							icon={<BiRotateRight/>}
							onClick={
								() => {
									let r = selectedFile.rotateDeg + 90;
									if (r > 180) r -= 360;
									selectedFile.rotateDeg = r;
									onUpdateFile(selectedFile);
								}
							}
						/>
					</Stack>
				</Form>
			}
		</Form>

	)
}
