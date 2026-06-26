import {ProductsClient} from "./ProductsClient";
import {PrintTypesClient} from "./PrintTypesClient";
import {DesignsClient} from "./DesignsClient";
import {ProductColorsClient} from "./ProductColorsClient";
import {PrintZonesClient} from "./PrintZonesClient";
import {PrintPreviewsClient} from "./PrintPreviewsClient";
import {AccountsClient} from "./AccountsClient";
import {ShopsClient} from "./ShopsClient";
import {UsersClient} from "./UsersClient";
import {ImageCacheClient} from "./ImageCacheClient";
import {ProductSizesClient} from "./ProductSizesClient";
import {CreatorsClient} from "./CreatorsClient";
import {ShopCustomersClient} from "./ShopCustomersClient";
import {ShopCategoriesClient} from "./ShopCategoriesClient";
import {ShopProductsClient} from "./ShopProductsClient";
import {ShopOrdersClient} from "./ShopOrdersClient";
import OmSecuredRestClient, {useSecuredRestClient} from "../../../shared/client/OmSecuredRestClient";

export class AdminRestClient {

	public products: ProductsClient;

	public accounts: AccountsClient;

	public shops: ShopsClient;

	public shopCategories: ShopCategoriesClient;

	public shopProducts: ShopProductsClient;

	public shopOrders: ShopOrdersClient;

	public shopCustomers: ShopCustomersClient;

	public users: UsersClient;

	public creators: CreatorsClient;

	public imageCache: ImageCacheClient;

	public printTypes: PrintTypesClient;

	public printZones: PrintZonesClient;

	public printPreviews: PrintPreviewsClient;

	public designs: DesignsClient;

	public productColors: ProductColorsClient;

	public productSizes: ProductSizesClient;

	constructor(client: OmSecuredRestClient) {
		this.products = new ProductsClient(client);
		this.accounts = new AccountsClient(client);
		this.shops = new ShopsClient(client);
		this.shopCategories = new ShopCategoriesClient(client);
		this.shopProducts = new ShopProductsClient(client);
		this.shopOrders = new ShopOrdersClient(client);
		this.users = new UsersClient(client);
		this.creators = new CreatorsClient(client);
		this.shopCustomers = new ShopCustomersClient(client);
		this.imageCache = new ImageCacheClient(client);
		this.printTypes = new PrintTypesClient(client);
		this.printZones = new PrintZonesClient(client);
		this.printPreviews = new PrintPreviewsClient(client);
		this.designs = new DesignsClient(client);
		this.productColors = new ProductColorsClient(client);
		this.productSizes = new ProductSizesClient(client);
	}

}

export function useAdminRestClient(): AdminRestClient {
	const securedClient = useSecuredRestClient();
	if (!securedClient) throw new Error("useAdminRestClient must be used within SecuredApp!");
	return new AdminRestClient(securedClient);
}
