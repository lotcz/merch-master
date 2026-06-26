import {RestClient} from "zavadil-ts-common";
import {PrintTypeAdminPayload, PrintTypeStub} from "../../../shared/types/PrintType";

/**
 * Special client using PrintTypeAdminPayload
 */
export class PrintTypesClient {
	private client: RestClient;
	private name: string = "admin/print-types";

	constructor(client: RestClient) {
		this.client = client;
	}

	loadByProduct(productId: number): Promise<Array<PrintTypeStub>> {
		return this.client.getJson(`${this.name}/by-product/${productId}`);
	}

	loadById(id: number): Promise<PrintTypeAdminPayload> {
		return this.client.getJson(`${this.name}/${id}`);
	}

	save(document: PrintTypeAdminPayload): Promise<PrintTypeAdminPayload> {
		return document.printType.id
			? this.client.putJson(`${this.name}/${document.printType.id}`, document)
			: this.client.postJson(this.name, document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`${this.name}/${id}`);
	}
}
