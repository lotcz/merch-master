import {EntityWithName} from "zavadil-ts-common";
import {Shop} from "./Shop";
import {ShopCategory} from "./ShopCategory";
import {Design} from "./Design";

export type ShopProductBase = EntityWithName & {
	visible: boolean;
	creatorProfit: number;
}

export type ShopProduct = ShopProductBase & {
	shop: Shop;
	category: ShopCategory;
	design: Design;
}

export type ShopProductStub = ShopProductBase & {
	shopId: number;
	categoryId: number;
	designId: number;
}
