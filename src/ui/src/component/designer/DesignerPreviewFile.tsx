import React from "react";
import {DesignFileStub} from "../../types/DesignFile";
import {PIXEL_PER_MM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {NumberUtil, Vector2} from "zavadil-ts-common";

export type DesignerPreviewFileParams = {
	file: DesignFileStub;
	zoneScale: Vector2;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerPreviewFile(
	{
		file,
		zoneScale,
		maxHeight,
		maxWidth
	}: DesignerPreviewFileParams
) {

	return (
		<div
			className="designer-preview-file"
			draggable={false}
			style={
				{
					top: file.positionYMm * PIXEL_PER_MM * zoneScale.y,
					left: file.positionXMm * PIXEL_PER_MM * zoneScale.x,
					width: file.imageWidthMm * PIXEL_PER_MM * zoneScale.x,
					height: file.imageHeightMm * PIXEL_PER_MM * zoneScale.y
				}
			}
		>
			<ImagezImage
				name={file.imageName}
				type="Fit"
				width={NumberUtil.round(maxWidth)}
				height={NumberUtil.round(maxHeight)}
			/>
		</div>
	)
}
