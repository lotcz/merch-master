import React, {MouseEvent, MouseEventHandler, useCallback, useContext, useMemo, useState} from "react";
import {PrintZoneStub} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import {NumberUtil, Vector2} from "zavadil-ts-common";
import DesignerFile from "./DesignerFile";
import {UploadImageDialogContext} from "../../util/UploadImageDialogContext";
import {DesignFileStub} from "../../types/DesignFile";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";
import {ImageHealth} from "../../types/Image";
import {ImagezUploadButton} from "../images/ImagezUploadButton";

export type DesignerPrintZoneParams = {
	printZone: PrintZoneStub;
	design: DesignPayload;
	maxWidth: number;
	maxHeight: number;
	selectedFile?: DesignFileStub;
	readOnly: boolean;
	onChange: (design: DesignPayload) => any;
	onUpdateFile: (file: DesignFileStub) => any;
	onFileSelected: (selectedFile?: DesignFileStub) => any;
}

export default function DesignerPrintZone({
	printZone,
	design,
	maxWidth,
	maxHeight,
	readOnly,
	selectedFile,
	onUpdateFile,
	onChange,
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
			return ImageUtil.imageFitScale(
				widthMm * PIXEL_PER_MM,
				heightMm * PIXEL_PER_MM,
				maxWidth,
				maxHeight
			);
		},
		[widthMm, heightMm, maxHeight, maxWidth]
	);

	const width = useMemo(() => Math.round(widthMm * PIXEL_PER_MM * scale), [widthMm, scale]);
	const height = useMemo(() => Math.round(heightMm * PIXEL_PER_MM * scale), [heightMm, scale]);

	const uploadImage = useCallback(
		(originalName: string, health: ImageHealth) => {
			const imageScale = ImageUtil.imageFitScale(
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
				imageName: health.name,
				originalImageName: originalName,
				originalImageHeightPx: health.height,
				originalImageWidthPx: health.width,
				positionXMm: (widthMm - imageWidth) / 2,
				positionYMm: (heightMm - imageHeight) / 2,
				imageWidthMm: imageWidth,
				imageHeightMm: imageHeight,
				aspectLocked: true,
				rotateDeg: 0,
				removeBackground: false,
				removeBackgroundR: 255,
				removeBackgroundG: 255,
				removeBackgroundB: 255,
				removeBackgroundThreshold: 0
			};
			design.files = [...design.files, file];
			onChange({...design});
			onFileSelected(file);
			uploadImageDialog.hide();
		},
		[uploadImageDialog, design, printZone, onChange, widthMm, heightMm, onFileSelected]
	);

	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [moveImagePosition, setMoveImagePosition] = useState<Vector2>();

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!selectedFile) return;
			if (!(moveImagePosition || isResizing)) return;

			const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / scale).multiply(1 / PIXEL_PER_MM);

			if (isResizing) {
				selectedFile.imageWidthMm = pos.x - selectedFile.positionXMm;
				selectedFile.imageHeightMm = pos.y - selectedFile.positionYMm;

				if (selectedFile.aspectLocked) {
					const aspect = selectedFile.originalImageWidthPx / selectedFile.originalImageHeightPx;
					selectedFile.imageHeightMm = selectedFile.imageWidthMm / aspect;
				}

			} else if (moveImagePosition) {
				selectedFile.positionXMm = pos.x - moveImagePosition.x;
				selectedFile.positionYMm = pos.y - moveImagePosition.y;
			}

			onUpdateFile(selectedFile);
		},
		[isResizing, moveImagePosition, selectedFile, scale, onUpdateFile]
	);

	const files = useMemo(
		() => design.files.filter(f => f.printZoneId === printZone.id),
		[design, printZone]
	)

	return (
		<div className="print-zone">
			<div className="mb-2 d-flex align-items-center gap-2">
				<div>Rozměry: {widthCm} x {heightCm} cm</div>
				{
					(!readOnly) && <ImagezUploadButton name="Nahrát..." onSelected={uploadImage}/>
				}
			</div>
			<div
				className={`boundary ${isResizing ? 'resizing' : ''} ${moveImagePosition ? 'moving' : ''}`}
				style={{width: width, height: height}}
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
							key={file.imageName}
							scale={scale}
							maxWidth={width}
							maxHeight={height}
							isSelected={file === selectedFile}
							isManipulating={isResizing || moveImagePosition !== undefined}
							readOnly={readOnly}
							onSelected={() => onFileSelected(file)}
							onStartMove={setMoveImagePosition}
							onEndMove={() => setMoveImagePosition(undefined)}
							onStartResize={() => setIsResizing(true)}
							onEndResize={() => setIsResizing(false)}
							onDeleted={
								() => {
									onChange({design: design.design, files: design.files.filter(f => f !== file)});
									onFileSelected(undefined);
								}
							}
							onLockUnlock={
								() => {
									file.aspectLocked = !file.aspectLocked;
									if (file.aspectLocked) {
										const aspect = file.originalImageWidthPx / file.originalImageHeightPx;
										file.imageHeightMm = file.imageWidthMm / aspect;
									}
									onUpdateFile(file);
								}
							}
						/>
					)
				}
			</div>
		</div>
	)
}
