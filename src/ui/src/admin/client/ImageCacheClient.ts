import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ImageCache, ImageCacheStub} from "../../shared/types/Image";

export class ImageCacheClient extends EntityClientWithStub<ImageCache, ImageCacheStub> {
	constructor(client: RestClient) {
		super(client, "admin/image-cache");
	}

	loadByAccount(accountId: number, pr: PagingRequest): Promise<Page<ImageCache>> {
		return this.client.getJson(`${this.name}/by-account/${accountId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}
}
