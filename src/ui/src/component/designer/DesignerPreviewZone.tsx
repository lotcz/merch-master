import React, {useMemo} from "react";
import {PIXEL_PER_MM} from "../../util/ImageUtil";
import {PrintPreviewZoneStub} from "../../types/PrintPreviewZone";
import {DesignPayload} from "../../types/Design";
import DesignerPreviewFile from "./DesignerPreviewFile";

export type DesignerPreviewZoneParams = {
	design: DesignPayload;
	previewZone: PrintPreviewZoneStub;
	scale: number;
}

export default function DesignerPreviewZone(
	{
		design,
		previewZone,
		scale
	}: DesignerPreviewZoneParams
) {
	const files = useMemo(
		() => design.files.filter((f) => f.printZoneId === previewZone.printZoneId),
		[design, previewZone]
	);

	return (
		<div
			className="designer-preview-zone"
			draggable={false}
			style={
				{
					top: previewZone.startYMm * PIXEL_PER_MM * scale,
					left: previewZone.startXMm * PIXEL_PER_MM * scale,
					width: previewZone.widthMm * PIXEL_PER_MM * scale,
					height: previewZone.heightMm * PIXEL_PER_MM * scale
				}
			}
		>
			{
				files.map(
					(file) => <DesignerPreviewFile
						file={file}
						scale={scale}
						maxWidth={previewZone.widthMm}
						maxHeight={previewZone.heightMm}
					/>
				)
			}
		</div>
	)
}
