import {EntityWithName} from "zavadil-ts-common";
import {Account} from "./Account";
import {SyncState} from "./SyncState";

export type ShopState = "Pending" | "Approved" | "Disabled";

export type ShopBase = EntityWithName & {
	slug: string;
	state: ShopState;
	syncState: SyncState;
}

export type Shop = ShopBase & {
	account: Account;
}

export type ShopStub = ShopBase & {
	accountId: number;
}
