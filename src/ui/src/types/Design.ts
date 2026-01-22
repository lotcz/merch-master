import {EntityBase} from "zavadil-ts-common";

export type DesignBase = EntityBase & {
	uuid: string;
}

export type Design = {
	baseUrl: string;
	secretToken: string;
}
