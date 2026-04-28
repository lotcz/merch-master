import {EntityBase} from "zavadil-ts-common";
import {ShopCustomer} from "./ShopCustomer";

export type ShopOrderBase = EntityBase & {
	orderState: string;
	shippingName?: string | null;
	shippingStreet?: string | null;
	shippingCity?: string | null;
	shippingZip?: number | null;
	useShippingAddress: boolean;
	billingName?: string | null;
	billingStreet?: string | null;
	billingCity?: string | null;
	billingZip?: number | null;
	totalPrice: number;
}

export type ShopOrder = ShopOrderBase & {
	customer: ShopCustomer;
}

export type ShopOrderStub = ShopOrderBase & {
	customerId: number;
}
