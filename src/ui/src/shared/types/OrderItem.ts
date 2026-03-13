import {EntityBase} from "zavadil-ts-common";
import {Order} from "./Order";
import {Product} from "./Product";

export type OrderItemBase = EntityBase & {
	unitPrice: number;
	unitCount: number;
}

export type OrderItem = OrderItemBase & {
	order: Order;
	product: Product;
}

export type OrderItemStub = OrderItemBase & {
	orderId: number;
	productId: number;
}
