import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";
import {PrintZoneStub} from "./PrintZone";
import {PrintPreviewPayload} from "./PrintPreview";

export type PrintTypeBase = EntityWithName & {}

export type PrintType = PrintTypeBase & {
	product: Product;
}

export type PrintTypeStub = PrintTypeBase & {
	productId: number;
}

export type PrintTypePayload = {
	printType: PrintTypeStub;
	zones: Array<PrintZoneStub>;
	previews: Array<PrintPreviewPayload>;
}

export type PrintTypeAdminPayload = {
	printType: PrintTypeStub;
	zones: Array<number>;
	previews: Array<number>;
}
