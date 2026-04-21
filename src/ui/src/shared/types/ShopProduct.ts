import {EntityWithName} from "zavadil-ts-common";
import {Shop} from "./Shop";
import {ShopCategory} from "./ShopCategory";
import {Design} from "./Design";

export type ShopProductBase = EntityWithName & {
	visible: boolean;
	creatorProfit: number;
	description?: string | null;
}

export type ShopProduct = ShopProductBase & {
	shop: Shop;
	category?: ShopCategory | null;
	design: Design;
}

export type ShopProductStub = ShopProductBase & {
	shopId: number;
	categoryId?: number | null;
	designId: number;
}
