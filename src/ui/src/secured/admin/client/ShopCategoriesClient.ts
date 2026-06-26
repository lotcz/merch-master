import {EntityClientWithStub, Page, PagingRequest, PagingUtil, RestClient} from "zavadil-ts-common";
import {ShopCategory, ShopCategoryStub} from "../../../shared/types/ShopCategory";

export class ShopCategoriesClient extends EntityClientWithStub<ShopCategory, ShopCategoryStub> {
	constructor(client: RestClient) {
		super(client, "admin/shop-categories");
	}

	loadFull(categoryId: number): Promise<ShopCategory> {
		return this.client.getJson(`${this.name}/${categoryId}/full`);
	}

	loadByShop(shopId: number, pr: PagingRequest): Promise<Page<ShopCategory>> {
		return this.client.getJson(`${this.name}/by-shop/${shopId}`, PagingUtil.pagingRequestToQueryParams(pr));
	}
}
