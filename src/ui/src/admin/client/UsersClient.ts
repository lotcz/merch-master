import {EntityClientWithStub, RestClient} from "zavadil-ts-common";
import {User, UserStub} from "../../shared/types/User";

export class UsersClient extends EntityClientWithStub<User, UserStub> {
	constructor(client: RestClient) {
		super(client, "admin/users");
	}

	loadByAccount(accountId: number): Promise<Array<User>> {
		return this.client.getJson(`${this.name}/by-account/${accountId}`);
	}
}
