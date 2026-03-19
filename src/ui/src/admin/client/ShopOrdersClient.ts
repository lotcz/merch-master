import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ShopOrder, ShopOrderStub} from "../../shared/types/ShopOrder";

export class ShopOrdersClient extends EntityClientWithStub<ShopOrder, ShopOrderStub> {
	constructor(client: RestClient) {
		super(client, "admin/shop-orders");
	}

	loadByShop(shopId: number, pr: PagingRequest): Promise<Page<ShopOrder>> {
		return this.client.getJson(`${this.name}/by-shop/${shopId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadByCustomer(customerId: number, pr: PagingRequest): Promise<Page<ShopOrder>> {
		return this.client.getJson(`${this.name}/by-customer/${customerId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}
}
