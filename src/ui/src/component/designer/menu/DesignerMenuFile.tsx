import {Button, Form, Spinner, Stack} from "react-bootstrap";
import React, {useCallback, useContext, useMemo, useState} from "react";
import {Product} from "../../../types/Product";
import {IconButton, Switch} from "zavadil-react-common";
import {DesignFileStub} from "../../../types/DesignFile";
import ResetableRange from "../../general/ResetableRange";
import {PrintZoneStub} from "../../../types/PrintZone";
import ImageUtil, {PIXEL_PER_MM} from "../../../util/ImageUtil";
import {DesignPayload} from "../../../types/Design";
import {BsTrash} from "react-icons/bs";
import {BiRotateLeft, BiRotateRight} from "react-icons/bi";
import {StringUtil} from "zavadil-ts-common";
import {ImagezRestClientContext} from "../../../client/imagez/ImagezClient";
import {ImagezColorPayload} from "../../../types/Image";

export type DesignerMenuFileParams = {
	product: Product;
	design: DesignPayload;
	readOnly: boolean;
	admin: boolean;
	selectedFile: DesignFileStub;
	selectedZone: PrintZoneStub;
	onUpdateFile: (file: DesignFileStub) => any;
	onFileDeleted: () => any;
	onError: (error: string) => any;
}

export default function DesignerMenuFile({
	product,
	design,
	readOnly,
	admin,
	selectedFile,
	selectedZone,
	onUpdateFile,
	onFileDeleted,
	onError
}: DesignerMenuFileParams) {
	const imagezClient = useContext(ImagezRestClientContext);

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

	const [guessing, setGuessing] = useState<boolean>(false);

	const guessBackground: () => Promise<ImagezColorPayload | null> = useCallback(
		(): Promise<ImagezColorPayload | null> => {
			setGuessing(true);
			return imagezClient.guessBackgroundColor(selectedFile.imageName).then(
				(c) => {
					setGuessing(false);
					return c;
				}
			);
		},
		[imagezClient, selectedFile]
	);

	return (
		<div>
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
							const scal = ImageUtil.imageFillScale(
								selectedFile.originalImageWidthPx / PIXEL_PER_MM,
								selectedFile.originalImageHeightPx / PIXEL_PER_MM,
								selectedZone.widthMm,
								selectedZone.heightMm
							);

							const width = scal * selectedFile.originalImageWidthPx / PIXEL_PER_MM;
							const height = scal * selectedFile.originalImageHeightPx / PIXEL_PER_MM;
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
							const scal = ImageUtil.imageFitScale(
								selectedFile.originalImageWidthPx / PIXEL_PER_MM,
								selectedFile.originalImageHeightPx / PIXEL_PER_MM,
								selectedZone.widthMm,
								selectedZone.heightMm
							);

							const width = scal * selectedFile.originalImageWidthPx / PIXEL_PER_MM;
							const height = scal * selectedFile.originalImageHeightPx / PIXEL_PER_MM;
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

			<Switch
				id="odebrat-pozadi"
				label="Odebrat pozadí"
				checked={StringUtil.notBlank(selectedFile.removeBackgroundColor)}
				onChange={
					(b) => {
						if (b && StringUtil.isBlank(selectedFile.removeBackgroundColor)) {
							selectedFile.removeBackgroundColor = '#ffffff';
							guessBackground().then(
								(c) => {
									if (c) {
										selectedFile.removeBackgroundColor = c.hex;
										selectedFile.removeBackgroundThreshold = 30;
										onUpdateFile(selectedFile);
									}
								}
							);
						} else {
							selectedFile.removeBackgroundColor = null;
							onUpdateFile(selectedFile);
						}
					}
				}
			/>

			{
				StringUtil.notBlank(selectedFile.removeBackgroundColor) && <div>
					<ResetableRange
						label={`Tolerance (${selectedFile.removeBackgroundThreshold})`}
						defaultValue={10}
						value={selectedFile.removeBackgroundThreshold}
						min={0}
						max={255}
						step={0.1}
						onChange={
							(r) => {
								selectedFile.removeBackgroundThreshold = r;
								onUpdateFile(selectedFile);
							}
						}
					/>

					<Stack className="mt-2" direction="horizontal" gap={2}>
						Barva pozadí:
						{
							guessing ? <Spinner size="sm"/>
								: <Form.Control
									type="color"
									value={StringUtil.getNonEmpty(selectedFile.removeBackgroundColor)}
									onChange={
										(e) => {
											selectedFile.removeBackgroundColor = StringUtil.blankToNull(e.target.value);
											onUpdateFile(selectedFile);
										}
									}
								/>
						}
					</Stack>
				</div>
			}
			<div className="text-center mt-2">
				<IconButton
					variant="danger"
					size="sm"
					icon={<BsTrash/>}
					onClick={onFileDeleted}
				>Odstranit</IconButton>
			</div>
		</div>
	)
}
