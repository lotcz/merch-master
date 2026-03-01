import {EntityBase} from "zavadil-ts-common";
import {PrintZone} from "./PrintZone";
import {PrintPreview} from "./PrintPreview";

export type PrintPreviewZoneBase = EntityBase & {
	startXPx: number;
	startYPx: number;
	widthPx: number;
	heightPx: number;
	rotateDeg: number;
	skewXDeg: number;
	skewYDeg: number;
	aspectLocked: boolean;
	useCylinderEffect: boolean;
	cylinderSlices: number;
	cylinderVerticalAngle: number;
	cylinderPerspective: number;
	cylinderRadius: number;
	cylinderStartAngle: number;
	cylinderEndAngle: number;
	useViewCrop: boolean;
	viewCropOffsetXMm: number;
	viewCropOffsetYMm: number;
	viewCropWidthMm: number;
	viewCropHeightMm: number;
}

export type PrintPreviewZone = PrintPreviewZoneBase & {
	printPreview: PrintPreview;
	printZone: PrintZone;
}

export type PrintPreviewZoneStub = PrintPreviewZoneBase & {
	printPreviewId: number;
	printZoneId: number;
}
