import conf from "../config/conf.json";
import { RestClientWithOAuth, OAuthRefreshTokenProvider, RefreshTokenPayload } from "zavadil-ts-common";
import {} from "zavadil-ts-common";

export class NoOauthToken implements OAuthRefreshTokenProvider {
	getRefreshToken(): Promise<RefreshTokenPayload> {
		throw new Error("This client does not support OAuth!");
	}

	reset(): Promise<any> {
		return Promise.resolve();
	}
}

export class MmRestClient extends RestClientWithOAuth {
	private prefixedUrl: URL;

	constructor(refreshTokenProvider?: OAuthRefreshTokenProvider, pathPrefix?: string, scope?: string) {
		super(conf.API_URL, refreshTokenProvider, scope);
		this.prefixedUrl = pathPrefix ? new URL(`${super.getBaseUrl()}${pathPrefix}/`) : super.getBaseUrl();
	}

	getBaseUrl(): URL {
		return this.prefixedUrl;
	}
}
