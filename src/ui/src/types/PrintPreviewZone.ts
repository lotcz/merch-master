import {EntityBase} from "zavadil-ts-common";
import {PrintZone} from "./PrintZone";
import {PrintPreview} from "./PrintPreview";

export type PrintPreviewZoneBase = EntityBase & {
	startXMm: number;
	startYMm: number;
	widthMm: number;
	heightMm: number;
}

export type PrintPreviewZone = PrintPreviewZoneBase & {
	printPreview: PrintPreview;
	printZone: PrintZone;
}

export type PrintPreviewZoneStub = PrintPreviewZoneBase & {
	printPreviewId: number;
	printZoneId: number;
}
