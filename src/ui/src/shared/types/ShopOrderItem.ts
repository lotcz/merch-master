import {EntityBase} from "zavadil-ts-common";
import {ShopOrder} from "./ShopOrder";
import {ShopProduct} from "./ShopProduct";

export type ShopOrderItemBase = EntityBase & {
	unitPrice: number;
	unitCount: number;
}

export type ShopOrderItem = ShopOrderItemBase & {
	order: ShopOrder;
	product: ShopProduct;
}

export type ShopOrderItemStub = ShopOrderItemBase & {
	orderId: number;
	productId: number;
}
