import {EntityWithName} from "zavadil-ts-common";
import {Account} from "./Account";
import {SyncState} from "./SyncState";

export type UserState = "Temporary" | "Active" | "Disabled";

export type UserBase = EntityWithName & {
	state: UserState;
	syncState: SyncState;
	oauthSubject?: string | null;
	email: string;
}

export type User = UserBase & {
	account: Account;
}

export type UserStub = UserBase & {
	accountId: number;
}
