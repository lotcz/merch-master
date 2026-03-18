import {EntityBase} from "zavadil-ts-common";
import {Account} from "./Account";
import {User} from "./User";

export type CreatorBase = EntityBase & {
	userState: string;
}

export type Creator = CreatorBase & {
	account: Account;
	user: User;
}

export type CreatorStub = CreatorBase & {
	accountId?: number | null;
	userId?: number | null;
}
