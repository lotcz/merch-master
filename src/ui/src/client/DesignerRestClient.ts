import conf from "../config/conf.json";
import {RestClient} from "zavadil-ts-common";
import {Product} from "../types/Product";
import {PrintTypePayload, PrintTypeStub} from "../types/PrintType";
import {DesignPayload} from "../types/Design";
import {ProductColorStub} from "../types/ProductColor";

/**
 * Client for public Designer - all endpoints should be unprotected
 */
export class DesignerRestClient extends RestClient {

	constructor() {
		super(`${conf.API_URL}/designer`);
	}

	loadProducts(): Promise<Array<Product>> {
		return this.getJson('products');
	}

	loadProduct(id: number): Promise<Product> {
		return this.getJson(`product/${id}`);
	}

	loadColorsByProduct(productId: number): Promise<Array<ProductColorStub>> {
		return this.getJson(`product-colors/by-product/${productId}`);
	}

	loadPrintTypesByProduct(productId: number): Promise<Array<PrintTypeStub>> {
		return this.getJson(`print-types/by-product/${productId}`);
	}

	loadPrintType(printTypeId: number): Promise<PrintTypePayload> {
		return this.getJson(`print-types/${printTypeId}`);
	}

	createNewDesign(): Promise<DesignPayload> {
		return this.loadProducts()
			.then(
				(products) => {
					if (products.length === 0) {
						throw new Error("NO PRODUCTS!");
					}
					const productId = Number(products[0].id);
					return this.loadPrintTypesByProduct(productId)
						.then(
							(printTypes) => {
								if (products.length === 0) {
									throw new Error("NO PRINT TYPES!");
								}
								const printTypeId = Number(printTypes[0].id);
								return this.loadColorsByProduct(productId)
									.then(
										(colors) => {
											if (colors.length === 0) {
												throw new Error("NO COLORS!");
											}
											const colorId = Number(colors[0].id);
											return {
												design: {
													printTypeId: printTypeId,
													productColorId: colorId,
													confirmed: false
												},
												files: []
											};
										}
									)
							}
						);
				}
			);
	}

	loadDesign(designUuid: string): Promise<DesignPayload> {
		return this.getJson(`designs/${designUuid}`);
	}

	saveDesign(design: DesignPayload): Promise<DesignPayload> {
		return this.putJson(`designs`, design);
	}

}
