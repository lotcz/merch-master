import {RestClient, StringUtil} from "zavadil-ts-common";
import {ImageHealth} from "../../types/Image";
import {createContext} from "react";
import conf from "../../config/conf.json";

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
		horizontalAlign?: string | null
	): Promise<string> {
		if (StringUtil.isBlank(name)) {
			return Promise.reject('Image name cannot be empty!');
		}
		return this.client.get(
			`imagez/url/resized/${name}`,
			{type, width, height, ext, verticalAlign, horizontalAlign}
		).then((r) => r.text());
	}

	getImageHealth(name: string): Promise<ImageHealth> {
		return this.client.getJson(`imagez/health/${name}`);
	}

	uploadFile(f: File): Promise<ImageHealth> {
		let formData = new FormData();
		formData.append("image", f);
		return this.client.postFormJson('imagez/upload', formData);
	}

}

export const ImagezRestClientContext = createContext(new ImagezClient(new RestClient(conf.API_URL)));
