import {EntityWithName} from "zavadil-ts-common";
import {PrintZone} from "./PrintZone";

export type PrintPreviewBase = EntityWithName & {
	imageName?: string | null;
	imageWidth: number;
	imageHeight: number;
	zoneStartX: number;
	zoneStartY: number;
	zoneWidth: number;
	zoneHeight: number;
}

export type PrintPreview = PrintPreviewBase & {
	printZone: PrintZone;
}

export type PrintPreviewStub = PrintPreviewBase & {
	printZoneId?: number | null;
}
