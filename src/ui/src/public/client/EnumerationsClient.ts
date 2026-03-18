import {LazyAsync, RestClient} from "zavadil-ts-common";

export class EnumerationsClient {

	private client: RestClient;

	public userStates: LazyAsync<string[]>;

	public syncStates: LazyAsync<string[]>;

	public orderStates: LazyAsync<string[]>;

	public shopStates: LazyAsync<string[]>;

	public accountStates: LazyAsync<string[]>;

	constructor(client: RestClient) {
		this.client = client;

		this.userStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/user-states')
		);

		this.syncStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/sync-states')
		);

		this.orderStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/order-states')
		);

		this.shopStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/shop-states')
		);

		this.accountStates = new LazyAsync<string[]>(
			() => this.client.getJson('enumerations/account-states')
		);

	}

}
