import {EntityWithName} from "zavadil-ts-common";
import {Customer} from "./Customer";

export type OrderBase = EntityWithName & {
	billingDate: Date;
	state: string;
	syncState: string;
}

export type Order = OrderBase & {
	customer: Customer;
}

export type OrderStub = OrderBase & {
	customerId: number;
}
