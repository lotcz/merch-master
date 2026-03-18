import {EntityWithName} from "zavadil-ts-common";

export type UserBase = EntityWithName & {
	syncState: string;
	oauthSubject?: string | null;
	email: string;
}

export type User = UserBase & {}

