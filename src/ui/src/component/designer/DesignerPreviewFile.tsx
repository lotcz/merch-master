import React from "react";
import {DesignFileStub} from "../../types/DesignFile";
import {PIXEL_PER_MM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {NumberUtil} from "zavadil-ts-common";

export type DesignerPreviewFileParams = {
	file: DesignFileStub;
	scale: number;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerPreviewFile(
	{
		file,
		scale,
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
					top: file.positionYMm * PIXEL_PER_MM * scale,
					left: file.positionXMm * PIXEL_PER_MM * scale,
					width: file.imageWidthMm * PIXEL_PER_MM * scale,
					height: file.imageHeightMm * PIXEL_PER_MM * scale
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
