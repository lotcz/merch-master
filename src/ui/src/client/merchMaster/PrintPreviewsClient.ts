import {RestClient} from "zavadil-ts-common";
import {PrintPreviewPayload, PrintPreviewStub} from "../../types/PrintPreview";

export class PrintPreviewsClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	loadByProduct(productId: number): Promise<Array<PrintPreviewStub>> {
		return this.client.getJson(`print-previews/by-product/${productId}`);
	}

	loadById(id: number): Promise<PrintPreviewPayload> {
		return this.client.getJson(`print-previews/${id}`);
	}

	save(document: PrintPreviewPayload): Promise<PrintPreviewPayload> {
		return document.printPreview.id ?
			this.client.putJson(`print-previews/${document.printPreview.id}`, document)
			: this.client.postJson('print-previews', document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`print-previews/${id}`);
	}

}
