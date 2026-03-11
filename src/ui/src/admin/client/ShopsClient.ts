import {EntityClientWithStub, RestClient} from "zavadil-ts-common";
import {Shop, ShopStub} from "../../shared/types/Shop";

export class ShopsClient extends EntityClientWithStub<Shop, ShopStub> {
	constructor(client: RestClient) {
		super(client, "admin/shops");
	}

	loadByAccount(accountId: number): Promise<Array<Shop>> {
		return this.client.getJson(`${this.name}/by-account/${accountId}`);
	}
}
