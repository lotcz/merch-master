import React, {useCallback, useContext, useMemo} from "react";
import {PrintZonePayload} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import {NumberUtil} from "zavadil-ts-common";
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
}

export default function DesignerPrintZone({printZone, design, maxWidth, maxHeight, onChanged}: DesignerPrintZoneParams) {
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
						const file: DesignFileStub = {
							designId: Number(design.design.id),
							printZoneId: Number(printZone.printZone.id),
							imageName: imageName,
							originalImageHeight: health.height,
							originalImageWidth: health.width,
							positionX: 0,
							positionY: 0,
							imageWidth: imageScale * health.width / PIXEL_PER_CM,
							imageHeight: imageScale * health.height / PIXEL_PER_CM
						};
						design.files = [...design.files, file];
						onChanged({...design})
						uploadImageDialog.hide();
					},
					onClose: () => uploadImageDialog.hide()
				}
			);
		},
		[uploadImageDialog, design, printZone, onChanged]
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
			<div className="boundary" style={{width: widthCm * PIXEL_PER_CM * scale, height: heightCm * PIXEL_PER_CM * scale}}>
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
						/>
					)
				}
			</div>
		</div>
	)
}
