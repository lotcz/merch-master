import React from "react";
import {PrintPreviewZoneStub} from "../../../../types/PrintPreviewZone";
import {Img} from "../../../images/Img";

export type DesignerPreviewFlatZoneParams = {
	zoneImage?: string;
	previewZone: PrintPreviewZoneStub;
	previewScale: number;
	width: number;
	height: number;
}

export default function DesignerPreviewFlatZone({
	zoneImage,
	previewZone,
	previewScale
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
			<Img url={zoneImage}/>
		</div>
	)
}
