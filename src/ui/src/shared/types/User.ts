import {EntityWithName} from "zavadil-ts-common";
import {SyncState} from "./SyncState";

export type UserState = "Temporary" | "Active" | "Disabled";

export type UserBase = EntityWithName & {
	syncState: SyncState;
	oauthSubject?: string | null;
	email: string;
}

export type User = UserBase & {}

