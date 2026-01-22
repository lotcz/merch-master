import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";

export type PrintTypeBase = EntityWithName & {}

export type PrintType = PrintTypeBase & {
	product: Product;
}

export type PrintTypeStub = PrintTypeBase & {
	productId: number;
}
