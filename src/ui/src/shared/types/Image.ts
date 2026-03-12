import {EntityBase} from "zavadil-ts-common";
import {Account} from "./Account";

export type ImageHealth = {
	name: string;
	size: number;
	width: number;
	height: number;
	mime: string;
}

export type ImagezSettingsPayload = {
	baseUrl: string;
	secretToken: string;
}

export type ImagezColorPayload = {
	hex: string;
}

export type ImageCacheBase = EntityBase & {
	imageName: string;
	originalImageName: string;
	originalImageWidthPx: number;
	originalImageHeightPx: number;
}

export type ImageCache = ImageCacheBase & {
	account: Account;
}

export type ImageCacheStub = ImageCacheBase & {
	accountId: number;
}
