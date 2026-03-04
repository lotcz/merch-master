import conf from "../config/conf.json";
import { RestClientWithOAuth, OAuthRefreshTokenProvider, RefreshTokenPayload } from "zavadil-ts-common";
import {} from "zavadil-ts-common";

class NoOauthToken implements OAuthRefreshTokenProvider {
	getRefreshToken(): Promise<RefreshTokenPayload> {
		throw new Error("This client does not support OAuth!");
	}

	reset(): Promise<any> {
		return Promise.resolve();
	}
}

export class MmRestClient extends RestClientWithOAuth {
	private prefix?: string;

	constructor(useOauth: boolean, pathPrefix?: string, scope?: string) {
		super(conf.API_URL, useOauth ? undefined : new NoOauthToken(), scope);
		this.prefix = pathPrefix;
	}

	getBaseUrl(): URL {
		return this.prefix ? new URL(`${super.getBaseUrl()}${this.prefix}/`) : super.getBaseUrl();
	}
}
