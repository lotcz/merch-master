import {EntityBase} from "zavadil-ts-common";
import {Shop} from "./Shop";
import {ShopCategory} from "./ShopCategory";
import {Design} from "./Design";

export type ShopOrderBase = EntityBase & {}

export type ShopOrder = ShopOrderBase & {
	shop: Shop;
	category?: ShopCategory | null;
	design: Design;
}

export type ShopOrderStub = ShopOrderBase & {
	shopId: number;
	categoryId?: number | null;
	designId: number;
}
