import {EntityBase} from "zavadil-ts-common";
import {PrintZone} from "./PrintZone";
import {Design} from "./Design";

export type DesignFileBase = EntityBase & {
	imageName: string;
	originalImageWidth: number;
	originalImageHeight: number;
	positionX: number;
	positionY: number;
	imageWidth: number;
	imageHeight: number;
	aspectLocked: boolean;
}

export type DesignFile = DesignFileBase & {
	design: Design;
	printZone: PrintZone;
}

export type DesignFileStub = DesignFileBase & {
	printZoneId: number;
	designId: number;
}
