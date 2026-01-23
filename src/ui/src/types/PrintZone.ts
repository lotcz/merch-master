import {EntityWithName} from "zavadil-ts-common";
import {PrintType} from "./PrintType";
import {PrintPreviewStub} from "./PrintPreview";

export type PrintZoneBase = EntityWithName & {
	width: number;
	height: number;
}

export type PrintZone = PrintZoneBase & {
	printType: PrintType;
}

export type PrintZoneStub = PrintZoneBase & {
	printTypeId: number;
}

export type PrintZonePayload = {
	printZone: PrintZoneStub;
	previews: Array<PrintPreviewStub>;
}
