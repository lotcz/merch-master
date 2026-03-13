import {EntityBase} from "zavadil-ts-common";
import {Account} from "./Account";
import {User, UserState} from "./User";

export type CreatorBase = EntityBase & {
	userState: UserState;
}

export type Creator = CreatorBase & {
	account: Account;
	user: User;
}

export type CreatorStub = CreatorBase & {
	accountId: number;
	userId: number;
}
