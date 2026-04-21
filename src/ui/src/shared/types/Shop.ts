import {EntityWithName} from "zavadil-ts-common";
import {Account} from "./Account";

export type ShopBase = EntityWithName & {
	slug: string;
	oauthAudienceName: string;
	state: string;
	syncState: string;
	description?: string | null;
	backgroundColor: string;
	foregroundColor: string;
	linkColor: string;
	fontFamily: string;
	brandBgColor: string;
	brandFgColor: string;
	brandImage?: string | null;
	brandShowName: boolean;
	brandFontFamily: string;
}

export type Shop = ShopBase & {
	account: Account;
}

export type ShopStub = ShopBase & {
	accountId: number;
}
