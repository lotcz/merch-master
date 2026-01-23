import {createContext} from "react";
import conf from "../config/conf.json";
import {RestClientWithOAuth} from "zavadil-ts-common";
import {MerchMasterStats} from "../types/Stats";
import {ImagezClient} from "./ImagezClient";
import {ProductsClient} from "./ProductsClient";
import {PrintTypesClient} from "./PrintTypesClient";
import {DesignsClient} from "./DesignsClient";

export class MerchMasterRestClient extends RestClientWithOAuth {

	public imagez: ImagezClient;

	public products: ProductsClient;

	public printTypes: PrintTypesClient;

	public designs: DesignsClient;

	constructor() {
		super(conf.API_URL);

		this.imagez = new ImagezClient(this);
		this.products = new ProductsClient(this);
		this.printTypes = new PrintTypesClient(this);
		this.designs = new DesignsClient(this);
	}

	version(): Promise<string> {
		return this.get('status/version').then((r) => r.text());
	}

	stats(): Promise<MerchMasterStats> {
		return this.getJson('status/stats');
	}


}

export const MerchMasterRestClientContext = createContext(new MerchMasterRestClient());
