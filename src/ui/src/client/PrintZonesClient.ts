import {RestClient} from "zavadil-ts-common";
import {PrintZoneStub} from "../types/PrintZone";

export class PrintZonesClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	loadByProduct(productId: number): Promise<Array<PrintZoneStub>> {
		return this.client.getJson(`print-zones/by-product/${productId}`);
	}

	loadById(id: number): Promise<PrintZoneStub> {
		return this.client.getJson(`print-zones/${id}`);
	}

	save(document: PrintZoneStub): Promise<PrintZoneStub> {
		return document.id ?
			this.client.putJson(`print-zones/${document.id}`, document)
			: this.client.postJson('print-zones', document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`print-zones/${id}`);
	}

}
