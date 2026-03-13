import {EntityWithName} from "zavadil-ts-common";
import {SyncState} from "./SyncState";
import {Customer} from "./Customer";

export type OrderState = "Cart" | "Pending" | "Processing" | "Finished" | "Cancelled" | "Returned" | "Refunded";

export type OrderBase = EntityWithName & {
	billingDate: Date;
	state: OrderState;
	syncState: SyncState;
}

export type Order = OrderBase & {
	customer: Customer;
}

export type OrderStub = OrderBase & {
	customerId: number;
}
