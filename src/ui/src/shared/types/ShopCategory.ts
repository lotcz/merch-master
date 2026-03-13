import {EntityWithName} from "zavadil-ts-common";
import {Shop} from "./Shop";

export type ShopCategoryBase = EntityWithName & {
	visible: boolean;
}

export type ShopCategory = ShopCategoryBase & {
	shop: Shop;
}

export type ShopCategoryStub = ShopCategoryBase & {
	shopId: number;
}
