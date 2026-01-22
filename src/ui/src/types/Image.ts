import {EntityBase} from "zavadil-ts-common";

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
