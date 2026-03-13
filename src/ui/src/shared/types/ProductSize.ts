import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";

export type ProductSizeBase = EntityWithName & {
	extraPrice: number;
}

export type ProductSize = ProductSizeBase & {
	product: Product;
}

export type ProductSizeStub = ProductSizeBase & {
	productId: number;
}
