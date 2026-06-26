import {EntityClient, RestClient} from "zavadil-ts-common";
import {PrintZoneStub} from "../../../shared/types/PrintZone";

export class PrintZonesClient extends EntityClient<PrintZoneStub> {
	constructor(client: RestClient) {
		super(client, "admin/print-zones");
	}

	loadByProduct(productId: number): Promise<Array<PrintZoneStub>> {
		return this.client.getJson(`${this.name}/by-product/${productId}`);
	}

}
