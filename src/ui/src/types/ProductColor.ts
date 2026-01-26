import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";

export type ProductColorBase = EntityWithName & {
	color: string;
}

export type ProductColor = ProductColorBase & {
	product: Product;
}

export type ProductColorStub = ProductColorBase & {
	productId: number;
}
