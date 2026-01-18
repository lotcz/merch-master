import {createContext} from "react";
import conf from "../config/conf.json";
import {RestClientWithOAuth} from "zavadil-ts-common";
import {MerchMasterStats} from "../types/Stats";

import {ImagesClient} from "./ImagesClient";


export class MerchMasterRestClient extends RestClientWithOAuth {

	public images: ImagesClient;

	constructor() {
		super(conf.API_URL);

		this.images = new ImagesClient(this);
	}

	version(): Promise<string> {
		return this.get('status/version').then((r) => r.text());
	}

	stats(): Promise<MerchMasterStats> {
		return this.getJson('status/stats');
	}


}

export const MerchMasterRestClientContext = createContext(new MerchMasterRestClient());
