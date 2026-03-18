import {EntityBase} from "zavadil-ts-common";
import {User} from "./User";
import {Shop} from "./Shop";

export type CustomerBase = EntityBase & {
	userState: string;
}

export type Customer = CustomerBase & {
	shop: Shop;
	user: User;
}

export type CustomerStub = CustomerBase & {
	shopId: number;
	userId: number;
}
