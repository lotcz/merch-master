import {EntityWithName} from "zavadil-ts-common";

export type AccountBase = EntityWithName & {
	uuid: string;
	state: string;
}

export type Account = AccountBase & {}
