import {RestClient} from "zavadil-ts-common";
import {PrintPreviewPayload, PrintPreviewStub} from "../../shared/types/PrintPreview";

/**
 * Special client using PrintPreviewPayload
 */
export class PrintPreviewsClient {
	private client: RestClient;
	private name: string = "admin/print-previews";

	constructor(client: RestClient) {
		this.client = client;
	}

	loadByProduct(productId: number): Promise<Array<PrintPreviewStub>> {
		return this.client.getJson(`${this.name}/by-product/${productId}`);
	}

	loadById(id: number): Promise<PrintPreviewPayload> {
		return this.client.getJson(`${this.name}/${id}`);
	}

	save(document: PrintPreviewPayload): Promise<PrintPreviewPayload> {
		return document.printPreview.id
			? this.client.putJson(`${this.name}/${document.printPreview.id}`, document)
			: this.client.postJson(this.name, document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`${this.name}/${id}`);
	}
}
