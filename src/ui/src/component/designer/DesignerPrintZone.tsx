import React, {MouseEvent, MouseEventHandler, useCallback, useContext, useMemo, useState} from "react";
import {PrintZonePayload} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import {NumberUtil, Vector2} from "zavadil-ts-common";
import DesignerFile from "./DesignerFile";
import {Button} from "react-bootstrap";
import {UploadImageDialogContext} from "../../util/UploadImageDialogContext";
import {DesignFileStub} from "../../types/DesignFile";
import ImageUtil, {PIXEL_PER_CM} from "../../util/ImageUtil";

export type DesignerPrintZoneParams = {
	printZone: PrintZonePayload;
	design: DesignPayload;
	onChanged: (design: DesignPayload) => any;
	maxWidth: number;
	maxHeight: number;
	selectedFile?: DesignFileStub;
	onFileSelected: (selectedFile?: DesignFileStub) => any;
}

export default function DesignerPrintZone({
	printZone,
	design,
	maxWidth,
	maxHeight,
	onChanged,
	selectedFile,
	onFileSelected
}: DesignerPrintZoneParams) {
	const uploadImageDialog = useContext(UploadImageDialogContext);

	const widthCm = useMemo(
		() => NumberUtil.round(printZone.printZone.width / 10, 1),
		[printZone]
	);

	const heightCm = useMemo(
		() => NumberUtil.round(printZone.printZone.height / 10, 1),
		[printZone]
	);

	const scale = useMemo(
		() => {
			return ImageUtil.getMaxScale(
				widthCm * PIXEL_PER_CM,
				heightCm * PIXEL_PER_CM,
				maxWidth,
				maxHeight
			);
		},
		[widthCm, heightCm, maxHeight, maxWidth]
	);

	const uploadImage = useCallback(
		() => {
			uploadImageDialog.show(
				{
					onSelected: (imageName, health) => {
						const imageScale = ImageUtil.getMaxScale(
							health.width / PIXEL_PER_CM,
							health.height / PIXEL_PER_CM,
							widthCm,
							heightCm
						);
						const imageWidth = imageScale * health.width / PIXEL_PER_CM;
						const imageHeight = imageScale * health.height / PIXEL_PER_CM;
						const file: DesignFileStub = {
							designId: Number(design.design.id),
							printZoneId: Number(printZone.printZone.id),
							imageName: imageName,
							originalImageHeight: health.height,
							originalImageWidth: health.width,
							positionX: (widthCm - imageWidth) / 2,
							positionY: (heightCm - imageHeight) / 2,
							imageWidth: imageWidth,
							imageHeight: imageHeight
						};
						design.files = [...design.files, file];
						onChanged({...design});
						uploadImageDialog.hide();
					},
					onClose: () => uploadImageDialog.hide()
				}
			);
		},
		[uploadImageDialog, design, printZone, onChanged, widthCm, heightCm]
	);

	const updateFile = useCallback(
		(file: DesignFileStub) => {
			const newFile = {...file};
			design.files = design.files.map(f => f === file ? newFile : f);
			onChanged({...design});
			if (file === selectedFile) onFileSelected(newFile);
		},
		[design, onChanged, selectedFile, onFileSelected]
	);

	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!selectedFile) return;
			if (!(isMoving || isResizing)) return;

			const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / scale).multiply(1 / PIXEL_PER_CM);

			if (isResizing) {
				const width = pos.x - selectedFile.positionX;
				const height = pos.y - selectedFile.positionY;
				selectedFile.imageWidth = width;
				selectedFile.imageHeight = height;
			} else if (isMoving) {
				selectedFile.positionX = pos.x - (selectedFile.imageWidth / 2);
				selectedFile.positionY = pos.y - (selectedFile.imageHeight / 2);
			}

			updateFile(selectedFile);
		},
		[isResizing, isMoving, selectedFile, scale, updateFile]
	);

	const files = useMemo(
		() => design.files.filter(f => f.printZoneId === printZone.printZone.id),
		[design, printZone]
	)

	return (
		<div className="print-zone">
			<div className="label">
				<h3>{printZone.printZone.name}</h3>
				({widthCm} x {heightCm} cm)
				<Button size="sm" onClick={uploadImage}>Nahrát obrázek...</Button>
			</div>
			<div
				className={`boundary ${isResizing ? 'resizing' : ''} ${isMoving ? 'moving' : ''}`}
				style={{width: widthCm * PIXEL_PER_CM * scale, height: heightCm * PIXEL_PER_CM * scale}}
				onMouseMove={onMouseMove}
				onMouseUp={
					(e: MouseEvent<HTMLDivElement>) => {
						setIsResizing(false);
						setIsMoving(false);
					}
				}
			>
				{
					files.map(
						(f) => <DesignerFile
							file={f}
							scale={scale}
							maxWidth={maxWidth}
							maxHeight={maxHeight}
							onChanged={
								(f) => {
									onChanged({design: {...design.design}, files: [...files]})
								}
							}
							isSelected={f === selectedFile}
							isManipulating={isResizing || isMoving}
							onSelected={() => onFileSelected(f)}
							onStartMove={() => setIsMoving(true)}
							onEndMove={() => setIsMoving(false)}
							onStartResize={() => setIsResizing(true)}
							onEndResize={() => setIsResizing(false)}
						/>
					)
				}
			</div>
		</div>
	)
}
