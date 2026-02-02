import React, {useMemo} from "react";
import {PrintPreviewZoneStub} from "../../types/PrintPreviewZone";
import {DesignPayload} from "../../types/Design";
import DesignerPreviewFile from "./DesignerPreviewFile";
import {PrintZoneStub} from "../../types/PrintZone";
import {Vector2} from "zavadil-ts-common";
import {PIXEL_PER_MM} from "../../util/ImageUtil";

export type DesignerPreviewZoneParams = {
	design: DesignPayload;
	zones: Array<PrintZoneStub>;
	previewZone: PrintPreviewZoneStub;
	previewScale: number;
}

export default function DesignerPreviewZone(
	{
		design,
		zones,
		previewZone,
		previewScale
	}: DesignerPreviewZoneParams
) {
	const files = useMemo(
		() => design.files.filter((f) => f.printZoneId === previewZone.printZoneId),
		[design, previewZone]
	);

	const zone = useMemo(
		() => zones.find((z) => z.id === previewZone.printZoneId),
		[zones, previewZone]
	);

	const zoneScale: Vector2 = useMemo(
		() => {
			if (!zone) return new Vector2(1, 1);
			return new Vector2(
				previewZone.widthPx / (zone.widthMm * PIXEL_PER_MM),
				previewZone.heightPx / (zone.heightMm * PIXEL_PER_MM)
			).multiply(previewScale)
		},
		[zone, previewZone, previewScale]
	);

	return (
		<div
			className="designer-preview-zone"
			draggable={false}
			style={
				{
					top: previewZone.startYPx * previewScale,
					left: previewZone.startXPx * previewScale,
					width: previewZone.widthPx * previewScale,
					height: previewZone.heightPx * previewScale,
					rotate: `${previewZone.rotateDeg}deg`
				}
			}
		>
			{
				files.map(
					(file, index) => <DesignerPreviewFile
						key={index}
						file={file}
						zoneScale={zoneScale}
					/>
				)
			}
		</div>
	)
}
