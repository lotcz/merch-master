import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ShopOrder, ShopOrderStub} from "../../shared/types/ShopOrder";
import {ShopOrderItemStub} from "../../shared/types/ShopOrderItem";

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

	loadItems(orderId: number): Promise<Array<ShopOrderItemStub>> {
		return this.client.getJson(`${this.name}/${orderId}/items`);
	}

	updateItems(orderId: number, items: Array<ShopOrderItemStub>): Promise<Array<ShopOrderItemStub>> {
		return this.client.putJson(`${this.name}/${orderId}/items`, items);
	}
}
