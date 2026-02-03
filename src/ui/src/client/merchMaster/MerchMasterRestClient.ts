import {createContext} from "react";
import conf from "../../config/conf.json";
import {RefreshTokenPayload, RestClientWithOAuth} from "zavadil-ts-common";
import {MerchMasterStats} from "../../types/Stats";
import {ProductsClient} from "./ProductsClient";
import {PrintTypesClient} from "./PrintTypesClient";
import {DesignsClient} from "./DesignsClient";
import {ProductColorsClient} from "./ProductColorsClient";
import {PrintZonesClient} from "./PrintZonesClient";
import {PrintPreviewsClient} from "./PrintPreviewsClient";
import {OAuthRefreshTokenProvider} from "zavadil-ts-common/dist/oauth/tokenprovider/OAuthRefreshTokenProvider";

class NoOauthToken implements OAuthRefreshTokenProvider {

	getRefreshToken(): Promise<RefreshTokenPayload> {
		throw new Error("This client does not support OAuth!");
		return Promise.reject("This client does not support OAuth!");
	}

	reset(): Promise<any> {
		return Promise.resolve();
	}
}

export class MerchMasterRestClient extends RestClientWithOAuth {

	public products: ProductsClient;

	public printTypes: PrintTypesClient;

	public printZones: PrintZonesClient;

	public printPreviews: PrintPreviewsClient;

	public designs: DesignsClient;

	public productColors: ProductColorsClient;

	constructor(useOauth: boolean) {
		super(conf.API_URL, useOauth ? undefined : new NoOauthToken());

		this.products = new ProductsClient(this);
		this.printTypes = new PrintTypesClient(this);
		this.printZones = new PrintZonesClient(this);
		this.printPreviews = new PrintPreviewsClient(this);
		this.designs = new DesignsClient(this);
		this.productColors = new ProductColorsClient(this);

	}

	version(): Promise<string> {
		return this.get('status/version').then((r) => r.text());
	}

	stats(): Promise<MerchMasterStats> {
		return this.getJson('status/stats');
	}

}

export const MerchMasterRestClientContext = createContext(new MerchMasterRestClient(false));
