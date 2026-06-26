import {EntityClient, RestClient} from "zavadil-ts-common";
import {ProductSizeStub} from "../../../shared/types/ProductSize";

export class ProductSizesClient extends EntityClient<ProductSizeStub> {
	constructor(client: RestClient) {
		super(client, "admin/product-sizes");
	}

	loadByProduct(productId: number): Promise<Array<ProductSizeStub>> {
		return this.client.getJson(`${this.name}/by-product/${productId}`);
	}
}
