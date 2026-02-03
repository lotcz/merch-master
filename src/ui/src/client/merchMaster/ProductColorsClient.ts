import {EntityClient, RestClient} from "zavadil-ts-common";
import {ProductColorStub} from "../../types/ProductColor";

export class ProductColorsClient extends EntityClient<ProductColorStub> {

	constructor(client: RestClient) {
		super(client, 'product-colors');
	}

	loadByProduct(productId: number): Promise<Array<ProductColorStub>> {
		return this.client.getJson(`product-colors/by-product/${productId}`);
	}

}
