import {EntityWithName} from "zavadil-ts-common";
import {Account} from "./Account";

export type ShopBase = EntityWithName & {
	slug: string;
	oauthAudienceName: string;
	state: string;
	syncState: string;
}

export type Shop = ShopBase & {
	account: Account;
}

export type ShopStub = ShopBase & {
	accountId: number;
}
