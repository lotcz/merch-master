import { createContext } from "react";
import { MerchMasterStats } from "../../shared/types/Stats";
import { ProductsClient } from "./ProductsClient";
import { PrintTypesClient } from "./PrintTypesClient";
import { DesignsClient } from "./DesignsClient";
import { ProductColorsClient } from "./ProductColorsClient";
import { PrintZonesClient } from "./PrintZonesClient";
import { PrintPreviewsClient } from "./PrintPreviewsClient";
import { MmRestClient } from "../../shared/client/MmRestClient";

export class AdminRestClient extends MmRestClient {
	public products: ProductsClient;

	public printTypes: PrintTypesClient;

	public printZones: PrintZonesClient;

	public printPreviews: PrintPreviewsClient;

	public designs: DesignsClient;

	public productColors: ProductColorsClient;

	constructor(useOauth: boolean) {
		super(useOauth);

		this.products = new ProductsClient(this);
		this.printTypes = new PrintTypesClient(this);
		this.printZones = new PrintZonesClient(this);
		this.printPreviews = new PrintPreviewsClient(this);
		this.designs = new DesignsClient(this);
		this.productColors = new ProductColorsClient(this);
	}

	version(): Promise<string> {
		return this.get("status/version").then((r) => r.text());
	}

	stats(): Promise<MerchMasterStats> {
		return this.getJson("status/stats");
	}
}

export const AdminRestClientContext = createContext(new AdminRestClient(false));
