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
import {ProductSizesClient} from "./ProductSizesClient";
import {CreatorsClient} from "./CreatorsClient";
import {CustomersClient} from "./CustomersClient";
import {ShopCategoriesClient} from "./ShopCategoriesClient";
import {ShopProductsClient} from "./ShopProductsClient";

export class AdminRestClient extends MmRestClient {

	public products: ProductsClient;

	public accounts: AccountsClient;

	public shops: ShopsClient;

	public shopCategories: ShopCategoriesClient;

	public shopProducts: ShopProductsClient;

	public users: UsersClient;

	public creators: CreatorsClient;

	public customers: CustomersClient;

	public imageCache: ImageCacheClient;

	public printTypes: PrintTypesClient;

	public printZones: PrintZonesClient;

	public printPreviews: PrintPreviewsClient;

	public designs: DesignsClient;

	public productColors: ProductColorsClient;

	public productSizes: ProductSizesClient;

	constructor(useOAuth: boolean) {
		super(useOAuth ? undefined : new NoOauthToken());

		this.products = new ProductsClient(this);
		this.accounts = new AccountsClient(this);
		this.shops = new ShopsClient(this);
		this.shopCategories = new ShopCategoriesClient(this);
		this.shopProducts = new ShopProductsClient(this);
		this.users = new UsersClient(this);
		this.creators = new CreatorsClient(this);
		this.customers = new CustomersClient(this);
		this.imageCache = new ImageCacheClient(this);
		this.printTypes = new PrintTypesClient(this);
		this.printZones = new PrintZonesClient(this);
		this.printPreviews = new PrintPreviewsClient(this);
		this.designs = new DesignsClient(this);
		this.productColors = new ProductColorsClient(this);
		this.productSizes = new ProductSizesClient(this);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<MerchMasterStats> {
		return this.getJson("status/stats");
	}
}

export const AdminRestClientContext = createContext(new AdminRestClient(false));
