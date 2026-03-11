import {Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Design, DesignPayload} from "../../shared/types/Design";

/**
 * Special client using DesignPayload
 */
export class DesignsClient {
	private client: RestClient;
	private name: string = "admin/designs";

	constructor(client: RestClient) {
		this.client = client;
	}

	loadPage(pr: PagingRequest): Promise<Page<Design>> {
		return this.client.getJson(this.name, PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadById(id: number): Promise<DesignPayload> {
		return this.client.getJson(`${this.name}/${id}`);
	}

	save(document: DesignPayload): Promise<DesignPayload> {
		return document.design.id ? this.client.putJson(`${this.name}/${document.design.id}`, document) : this.client.postJson(this.name, document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`${this.name}/${id}`);
	}
}
