import React, {useMemo} from "react";
import {DesignFileStub} from "../../../../types/DesignFile";
import {PIXEL_PER_MM} from "../../../../util/ImageUtil";
import {ImagezImage} from "../../../images/ImagezImage";
import {NumberUtil, Vector2} from "zavadil-ts-common";

export type DesignerPreviewFlatFileParams = {
	file: DesignFileStub;
	zoneScale: Vector2;
}

export default function DesignerPreviewFlatFile(
	{
		file,
		zoneScale
	}: DesignerPreviewFlatFileParams
) {

	const width = useMemo(
		() => NumberUtil.round(file.imageWidthMm * PIXEL_PER_MM * zoneScale.x),
		[file, zoneScale]
	);

	const height = useMemo(
		() => NumberUtil.round(file.imageHeightMm * PIXEL_PER_MM * zoneScale.x),
		[file, zoneScale]
	);

	return (
		<div
			className="designer-preview-file"
			draggable={false}
			style={
				{
					top: file.positionYMm * PIXEL_PER_MM * zoneScale.y,
					left: file.positionXMm * PIXEL_PER_MM * zoneScale.x,
					width: width,
					height: height
				}
			}
		>
			<ImagezImage
				name={file.imageName}
				type="Fit"
				width={width}
				height={height}
				snap={true}
			/>
		</div>
	)
}
