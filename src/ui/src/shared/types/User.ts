import {EntityWithName} from "zavadil-ts-common";

export type UserBase = EntityWithName & {
	email: string;
}

export type User = UserBase & {}

