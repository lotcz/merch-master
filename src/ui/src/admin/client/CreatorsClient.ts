import {EntityClientWithStub, RestClient} from "zavadil-ts-common";
import {Creator, CreatorStub} from "../../shared/types/Creator";

export class CreatorsClient extends EntityClientWithStub<Creator, CreatorStub> {
	constructor(client: RestClient) {
		super(client, "admin/creators");
	}

	loadByAccount(accountId: number): Promise<Array<Creator>> {
		return this.client.getJson(`${this.name}/by-account/${accountId}`);
	}
}
