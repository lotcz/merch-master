import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ShopCustomer, ShopCustomerStub} from "../../shared/types/ShopCustomer";

export class ShopCustomersClient extends EntityClientWithStub<ShopCustomer, ShopCustomerStub> {
	constructor(client: RestClient) {
		super(client, "admin/shop-customers");
	}

	loadFull(customerId: number): Promise<ShopCustomer> {
		return this.client.getJson(`${this.name}/${customerId}/full`);
	}

	loadByShop(shopId: number, pr: PagingRequest): Promise<Page<ShopCustomer>> {
		return this.client.getJson(`${this.name}/by-shop/${shopId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}
}
