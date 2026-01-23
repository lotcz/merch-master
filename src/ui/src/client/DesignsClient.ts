import {Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {Design, DesignPayload} from "../types/Design";

export class DesignsClient {

	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	loadPage(pr: PagingRequest): Promise<Page<Design>> {
		return this.client.getJson('designs', PagingUtil.pagingRequestToQueryParams(pr));
	}

	loadById(id: number): Promise<DesignPayload> {
		return this.client.getJson(`designs/${id}`);
	}

	save(document: DesignPayload): Promise<DesignPayload> {
		return document.design.id ?
			this.client.putJson(`designs/${document.design.id}`, document)
			: this.client.postJson('designs', document);
	}

	delete(id: number): Promise<any> {
		return this.client.del(`designs/${id}`);
	}

}
