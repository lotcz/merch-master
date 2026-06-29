import conf from "../config/conf.json";
import {RestClient} from "zavadil-ts-common";
import {OmStats} from "../types/Stats";

export default class OmRestClient extends RestClient {

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
