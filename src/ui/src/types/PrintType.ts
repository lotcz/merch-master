import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";
import {PrintZonePayload} from "./PrintZone";

export type PrintTypeBase = EntityWithName & {}

export type PrintType = PrintTypeBase & {
	product: Product;
}

export type PrintTypeStub = PrintTypeBase & {
	productId: number;
}

export type PrintTypePayload = {
	printType: PrintTypeStub;
	zones: Array<PrintZonePayload>;
}

export type PrintTypeAdminPayload = {
	printType: PrintTypeStub;
	zones: Array<number>;
}
