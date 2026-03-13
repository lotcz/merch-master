import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Creator} from "../../shared/types/Creator";
import {Customer, CustomerStub} from "../../shared/types/Customer";

export class CustomersClient extends EntityClientWithStub<Customer, CustomerStub> {
	constructor(client: RestClient) {
		super(client, "admin/customers");
	}

	loadByShop(shopId: number, pr: PagingRequest): Promise<Page<Creator>> {
		return this.client.getJson(`${this.name}/by-shop/${shopId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}
}
