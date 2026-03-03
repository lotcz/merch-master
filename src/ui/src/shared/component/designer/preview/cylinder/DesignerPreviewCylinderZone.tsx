import React from "react";
import {PrintPreviewZoneStub} from "../../../../types/PrintPreviewZone";
import CylinderEffect from "./CylinderEffect";

export type DesignerPreviewCylinderZoneParams = {
	zoneImage?: string;
	previewZone: PrintPreviewZoneStub;
	previewScale: number;
	width: number;
	height: number;
}

export default function DesignerPreviewCylinderZone({
	zoneImage,
	previewZone,
	previewScale,
	width,
	height
}: DesignerPreviewCylinderZoneParams) {

	return (
		<div
			className="designer-preview-zone-cylinder"
			draggable={false}
			style={
				{
					top: previewZone.startYPx * previewScale,
					left: previewZone.startXPx * previewScale,
					width: width,
					height: height,
					transformStyle: 'preserve-3d',
					transform: `rotate(${previewZone.rotateDeg}deg) skewX(${previewZone.skewXDeg}deg) skewY(${previewZone.skewYDeg}deg)`
				}
			}
		>
			{
				zoneImage && <CylinderEffect
					imageUrl={zoneImage}
					width={width}
					height={height}
					slices={previewZone.cylinderSlices}
					verticalAngle={previewZone.cylinderVerticalAngle}
					startAngle={previewZone.cylinderStartAngle}
					endAngle={previewZone.cylinderEndAngle}
					perspective={previewZone.cylinderPerspective * previewScale}
					radius={previewZone.cylinderRadius * previewScale}
				/>
			}
		</div>
	);
}
