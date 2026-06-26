import {NumberUtil, RestClient, StringUtil} from "zavadil-ts-common";
import {ImageHealth, ImagezColorPayload} from "../types/Image";
import {createContext, useContext} from "react";
import conf from "../config/conf.json";
import ImageUtil from "../util/ImageUtil";
import {PublicRestClient, PublicRestClientContext} from "../../public/client/PublicRestClient";

/**
 * Client for imagez - all endpoints should be unprotected
 */
export class ImagezClient {
	private client: RestClient;

	constructor(client: RestClient) {
		this.client = client;
	}

	getOrignalUrl(name: string): Promise<string> {
		return this.client.get(`imagez/url/original/${name}`).then((r) => r.text());
	}

	getResizedUrl(
		name: string,
		type: string,
		width: number,
		height: number,
		ext?: string,
		verticalAlign?: string | null,
		horizontalAlign?: string | null,
		snap: boolean = false,
	): Promise<string> {
		if (StringUtil.isBlank(name)) {
			return Promise.reject("Image name cannot be empty!");
		}

		if (width === 0 || height === 0) return Promise.resolve("");

		if (snap) {
			width = ImageUtil.snap(width);
			height = ImageUtil.snap(height);
		}

		return this.client.get(`imagez/url/resized/${name}`, {type, width, height, ext, verticalAlign, horizontalAlign}).then((r) => r.text());
	}

	getImageHealth(name: string): Promise<ImageHealth> {
		return this.client.getJson(`imagez/health/${name}`);
	}

	uploadFile(f: File): Promise<ImageHealth> {
		let formData = new FormData();
		formData.append("image", f);
		return this.client.postFormJson("imagez/upload", formData);
	}

	getRemoveBackgroundUrl(name: string, hex: string | null, threshold: number | null): string {
		threshold = threshold ? NumberUtil.round(threshold) : null;
		return this.client.getUrl(`imagez/colors/remove-background/${name}`, {hex, threshold}).toString();
	}

	guessBackgroundColor(name: string): Promise<ImagezColorPayload | null> {
		return this.client.getJson(`imagez/colors/guess-background/${name}`);
	}
}

export const ImagezRestClientContext = createContext(new ImagezClient(new RestClient(conf.API_URL)));

export function usePublicRestClient(): PublicRestClient {
	return useContext(PublicRestClientContext);
}
