import {EntityClient, RestClient} from "zavadil-ts-common";
import {ProductColorStub} from "../../../shared/types/ProductColor";

export class ProductColorsClient extends EntityClient<ProductColorStub> {
	constructor(client: RestClient) {
		super(client, "admin/product-colors");
	}

	loadByProduct(productId: number): Promise<Array<ProductColorStub>> {
		return this.client.getJson(`${this.name}/by-product/${productId}`);
	}
}
