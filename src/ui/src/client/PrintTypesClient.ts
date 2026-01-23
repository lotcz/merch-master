import {Page, RestClient} from "zavadil-ts-common";
import {DesignPayload} from "../types/Design";
import {PrintTypePayload, PrintTypeStub} from "../types/PrintType";

export class PrintTypesClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	loadByProduct(productId: number): Promise<Page<PrintTypeStub>> {
		return this.client.getJson(`print-types/by-product/${productId}`);
	}

	loadById(id: number): Promise<PrintTypePayload> {
		return this.client.getJson(`print-types/${id}`);
	}

	save(document: DesignPayload): Promise<PrintTypePayload> {
		return document.design.id ?
			this.client.putJson(`print-types/${document.design.id}`, document)
			: this.client.postJson('print-types', document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`print-types/${id}`);
	}

}
