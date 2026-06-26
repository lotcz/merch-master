import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ShopProduct, ShopProductStub} from "../../../shared/types/ShopProduct";

export class ShopProductsClient extends EntityClientWithStub<ShopProduct, ShopProductStub> {
	constructor(client: RestClient) {
		super(client, "admin/shop-products");
	}

	loadByShop(shopId: number, pr: PagingRequest): Promise<Page<ShopProduct>> {
		return this.client.getJson(`${this.name}/by-shop/${shopId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadFull(shopProductId: number): Promise<ShopProduct> {
		return this.client.getJson(`${this.name}/${shopProductId}/full`);
	}
}
