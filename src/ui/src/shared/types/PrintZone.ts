import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";

export type PrintZoneBase = EntityWithName & {
	widthMm: number;
	heightMm: number;
}

export type PrintZone = PrintZoneBase & {
	product: Product;
}

export type PrintZoneStub = PrintZoneBase & {
	productId: number;
}
