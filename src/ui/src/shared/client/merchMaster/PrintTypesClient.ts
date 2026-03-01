import {RestClient} from "zavadil-ts-common";
import {PrintTypeAdminPayload, PrintTypeStub} from "../../types/PrintType";

export class PrintTypesClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	loadByProduct(productId: number): Promise<Array<PrintTypeStub>> {
		return this.client.getJson(`print-types/by-product/${productId}`);
	}

	loadById(id: number): Promise<PrintTypeAdminPayload> {
		return this.client.getJson(`print-types/${id}`);
	}

	save(document: PrintTypeAdminPayload): Promise<PrintTypeAdminPayload> {
		return document.printType.id ?
			this.client.putJson(`print-types/${document.printType.id}`, document)
			: this.client.postJson('print-types', document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`print-types/${id}`);
	}

}
