import {createContext} from "react";
import {MerchMasterStats} from "../../shared/types/Stats";
import {ProductsClient} from "./ProductsClient";
import {PrintTypesClient} from "./PrintTypesClient";
import {DesignsClient} from "./DesignsClient";
import {ProductColorsClient} from "./ProductColorsClient";
import {PrintZonesClient} from "./PrintZonesClient";
import {PrintPreviewsClient} from "./PrintPreviewsClient";
import {MmRestClient, NoOauthToken} from "../../shared/client/MmRestClient";
import {AccountsClient} from "./AccountsClient";
import {ShopsClient} from "./ShopsClient";
import {UsersClient} from "./UsersClient";
import {ImageCacheClient} from "./ImageCacheClient";

export class AdminRestClient extends MmRestClient {

	public products: ProductsClient;

	public accounts: AccountsClient;

	public shops: ShopsClient;

	public users: UsersClient;

	public imageCache: ImageCacheClient;

	public printTypes: PrintTypesClient;

	public printZones: PrintZonesClient;

	public printPreviews: PrintPreviewsClient;

	public designs: DesignsClient;

	public productColors: ProductColorsClient;

	constructor(useOAuth: boolean) {
		super(useOAuth ? undefined : new NoOauthToken());

		this.products = new ProductsClient(this);
		this.accounts = new AccountsClient(this);
		this.shops = new ShopsClient(this);
		this.users = new UsersClient(this);
		this.imageCache = new ImageCacheClient(this);
		this.printTypes = new PrintTypesClient(this);
		this.printZones = new PrintZonesClient(this);
		this.printPreviews = new PrintPreviewsClient(this);
		this.designs = new DesignsClient(this);
		this.productColors = new ProductColorsClient(this);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<MerchMasterStats> {
		return this.getJson("status/stats");
	}
}

export const AdminRestClientContext = createContext(new AdminRestClient(false));
