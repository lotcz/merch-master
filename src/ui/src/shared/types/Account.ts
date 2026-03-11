import {EntityWithName} from "zavadil-ts-common";

export type AccountState = "Temporary" | "Pending" | "Approved" | "Disabled";

export type AccountBase = EntityWithName & {
	uuid: string;
	state: AccountState;
}

export type Account = AccountBase & {}
