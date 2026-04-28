import {EntityBase} from "zavadil-ts-common";
import {Shop} from "./Shop";
import {User} from "./User";

export type ShopCustomerBase = EntityBase & {
	userState: string;
}

export type ShopCustomer = ShopCustomerBase & {
	shop: Shop;
	user: User;
}

export type ShopCustomerStub = ShopCustomerBase & {
	shopId: number;
	userId: number;
}
