import React from "react";
import {PrintPreviewZoneStub} from "../../../../types/PrintPreviewZone";
import DesignerPreviewFlatFile from "./DesignerPreviewFlatFile";
import {Vector2} from "zavadil-ts-common";
import {DesignFileStub} from "../../../../types/DesignFile";

export type DesignerPreviewFlatZoneParams = {
	files: Array<DesignFileStub>;
	previewZone: PrintPreviewZoneStub;
	previewScale: number;
	zoneScale: Vector2;
}

export default function DesignerPreviewFlatZone({
	files,
	previewZone,
	previewScale,
	zoneScale
}: DesignerPreviewFlatZoneParams) {
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
					transform: `rotate(${previewZone.rotateDeg}deg) skewX(${previewZone.skewXDeg}deg) skewY(${previewZone.skewYDeg}deg)`
				}
			}
		>
			{
				files.map(
					(file, index) => <DesignerPreviewFlatFile
						key={index}
						file={file}
						zoneScale={zoneScale}
					/>
				)
			}
		</div>
	)
}
