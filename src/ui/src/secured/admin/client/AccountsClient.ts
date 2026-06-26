import {EntityClient, RestClient} from "zavadil-ts-common";
import {Account} from "../../../shared/types/Account";

export class AccountsClient extends EntityClient<Account> {
	constructor(client: RestClient) {
		super(client, "admin/accounts");
	}
}
