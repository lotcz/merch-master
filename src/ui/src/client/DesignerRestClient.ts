import conf from "../config/conf.json";
import {RestClient} from "zavadil-ts-common";
import {Product} from "../types/Product";
import {PrintTypePayload, PrintTypeStub} from "../types/PrintType";
import {DesignPayload} from "../types/Design";

export class DesignerRestClient extends RestClient {

	constructor() {
		super(`${conf.API_URL}/designer`);
	}

	loadProducts(): Promise<Array<Product>> {
		return this.getJson('products');
	}

	loadPrintTypesByProduct(productId: number): Promise<Array<PrintTypeStub>> {
		return this.getJson(`print-types/by-product/${productId}`);
	}

	loadPrintType(printTypeId: number): Promise<PrintTypePayload> {
		return this.getJson(`print-types/${printTypeId}`);
	}

	loadDesign(designUuid: string): Promise<DesignPayload> {
		return this.getJson(`designs/${designUuid}`);
	}

	saveDesign(design: DesignPayload): Promise<DesignPayload> {
		return this.putJson(`designs`, design);
	}

}
