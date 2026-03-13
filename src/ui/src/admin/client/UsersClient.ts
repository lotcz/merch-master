import {EntityClient, RestClient} from "zavadil-ts-common";
import {User} from "../../shared/types/User";

export class UsersClient extends EntityClient<User> {
	constructor(client: RestClient) {
		super(client, "admin/users");
	}

}
