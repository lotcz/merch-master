import { EntityClient, RestClient } from "zavadil-ts-common";
import { Product } from "../../shared/types/Product";

export class ProductsClient extends EntityClient<Product> {
	constructor(client: RestClient) {
		super(client, "products");
	}
}
