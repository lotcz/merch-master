import {EntityBase} from "zavadil-ts-common";
import {PrintZone} from "./PrintZone";
import {Design} from "./Design";

export type DesignFileBase = EntityBase & {
	imageName: string;
	originalImageName: string;
	originalImageWidthPx: number;
	originalImageHeightPx: number;
	positionXMm: number;
	positionYMm: number;
	imageWidthMm: number;
	imageHeightMm: number;
	aspectLocked: boolean;
	rotateDeg: number;
}

export type DesignFile = DesignFileBase & {
	design: Design;
	printZone: PrintZone;
}

export type DesignFileStub = DesignFileBase & {
	printZoneId: number;
	designId: number;
}
