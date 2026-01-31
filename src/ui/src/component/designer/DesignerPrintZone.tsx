import React, {MouseEvent, MouseEventHandler, useCallback, useContext, useMemo, useState} from "react";
import {PrintZoneStub} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import {NumberUtil, Vector2} from "zavadil-ts-common";
import DesignerFile from "./DesignerFile";
import {Button} from "react-bootstrap";
import {UploadImageDialogContext} from "../../util/UploadImageDialogContext";
import {DesignFileStub} from "../../types/DesignFile";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";

export type DesignerPrintZoneParams = {
	printZone: PrintZoneStub;
	design: DesignPayload;
	onChange: (design: DesignPayload) => any;
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
	onChange,
	selectedFile,
	onFileSelected
}: DesignerPrintZoneParams) {
	const uploadImageDialog = useContext(UploadImageDialogContext);

	const widthMm = useMemo(
		() => printZone.widthMm,
		[printZone]
	);

	const heightMm = useMemo(
		() => printZone.heightMm,
		[printZone]
	);

	const widthCm = useMemo(
		() => NumberUtil.round(widthMm / 10, 1),
		[widthMm]
	);

	const heightCm = useMemo(
		() => NumberUtil.round(heightMm / 10, 1),
		[heightMm]
	);

	const scale = useMemo(
		() => {
			return ImageUtil.getMaxScale(
				widthMm * PIXEL_PER_MM,
				heightMm * PIXEL_PER_MM,
				maxWidth,
				maxHeight
			);
		},
		[widthMm, heightMm, maxHeight, maxWidth]
	);

	const uploadImage = useCallback(
		() => {
			uploadImageDialog.show(
				{
					onSelected: (imageName, health) => {
						const imageScale = ImageUtil.getMaxScale(
							health.width / PIXEL_PER_MM,
							health.height / PIXEL_PER_MM,
							widthMm,
							heightMm
						);
						const imageWidth = imageScale * health.width / PIXEL_PER_MM;
						const imageHeight = imageScale * health.height / PIXEL_PER_MM;
						const file: DesignFileStub = {
							designId: Number(design.design.id),
							printZoneId: Number(printZone.id),
							imageName: imageName,
							originalImageHeightPx: health.height,
							originalImageWidthPx: health.width,
							positionXMm: (widthMm - imageWidth) / 2,
							positionYMm: (heightMm - imageHeight) / 2,
							imageWidthMm: imageWidth,
							imageHeightMm: imageHeight,
							aspectLocked: true
						};
						design.files = [...design.files, file];
						onChange({...design});
						uploadImageDialog.hide();
					},
					onClose: () => uploadImageDialog.hide()
				}
			);
		},
		[uploadImageDialog, design, printZone, onChange, widthMm, heightMm]
	);

	const updateFile = useCallback(
		(file: DesignFileStub) => {
			const newFile = {...file};
			design.files = design.files.map(f => f === file ? newFile : f);
			onChange({...design});
			if (file === selectedFile) onFileSelected(newFile);
		},
		[design, onChange, selectedFile, onFileSelected]
	);

	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [moveImagePosition, setMoveImagePosition] = useState<Vector2>();

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!selectedFile) return;
			if (!(moveImagePosition || isResizing)) return;

			const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / scale).multiply(1 / PIXEL_PER_MM);

			if (isResizing) {
				const width = pos.x - selectedFile.positionXMm;
				const height = pos.y - selectedFile.positionYMm;
				selectedFile.imageWidthMm = width;
				selectedFile.imageHeightMm = height;

				if (selectedFile.aspectLocked) {
					const aspect = selectedFile.originalImageWidthPx / selectedFile.originalImageHeightPx;
					selectedFile.imageHeightMm = selectedFile.imageWidthMm / aspect;
				}

			} else if (moveImagePosition) {
				selectedFile.positionXMm = pos.x - moveImagePosition.x;
				selectedFile.positionYMm = pos.y - moveImagePosition.y;
			}

			updateFile(selectedFile);
		},
		[isResizing, moveImagePosition, selectedFile, scale, updateFile]
	);

	const files = useMemo(
		() => design.files.filter(f => f.printZoneId === printZone.id),
		[design, printZone]
	)

	return (
		<div className="print-zone">
			<div className="label">
				<h3>{printZone.name}</h3>
				({widthCm} x {heightCm} cm)
				<Button size="sm" onClick={uploadImage}>Nahrát obrázek...</Button>
			</div>
			<div
				className={`boundary ${isResizing ? 'resizing' : ''} ${moveImagePosition ? 'moving' : ''}`}
				style={{width: widthMm * PIXEL_PER_MM * scale, height: heightMm * PIXEL_PER_MM * scale}}
				onMouseMove={onMouseMove}
				onMouseUp={
					(e: MouseEvent<HTMLDivElement>) => {
						setIsResizing(false);
						setMoveImagePosition(undefined);
					}
				}
				onMouseLeave={
					(e: MouseEvent<HTMLDivElement>) => {
						setIsResizing(false);
						setMoveImagePosition(undefined);
					}
				}
			>
				{
					files.map(
						(file, index) => <DesignerFile
							file={file}
							key={index}
							scale={scale}
							maxWidth={maxWidth}
							maxHeight={maxHeight}
							isSelected={file === selectedFile}
							isManipulating={isResizing || moveImagePosition !== undefined}
							onSelected={() => onFileSelected(file)}
							onStartMove={setMoveImagePosition}
							onEndMove={() => setMoveImagePosition(undefined)}
							onStartResize={() => setIsResizing(true)}
							onEndResize={() => setIsResizing(false)}
							onDeleted={
								() => {
									onChange({design: design.design, files: design.files.filter(f => f !== file)})
								}
							}
							onLockUnlock={
								() => {
									file.aspectLocked = !file.aspectLocked;
									if (file.aspectLocked) {
										const aspect = file.originalImageWidthPx / file.originalImageHeightPx;
										file.imageHeightMm = file.imageWidthMm / aspect;
									}
									updateFile(file);
								}
							}
						/>
					)
				}
			</div>
		</div>
	)
}
