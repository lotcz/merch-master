import conf from "../config/conf.json";
import {RestClient} from "zavadil-ts-common";
import {OmStats} from "../types/Stats";
import {createContext, useContext} from "react";

export default class OmPublicRestClient extends RestClient {

	constructor() {
		super(conf.API_URL);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<OmStats> {
		return this.getJson("status/stats");
	}
}

export const PublicRestClientContext = createContext<OmPublicRestClient>(new OmPublicRestClient());

export function usePublicRestClient(): OmPublicRestClient {
	return useContext(PublicRestClientContext);
}
