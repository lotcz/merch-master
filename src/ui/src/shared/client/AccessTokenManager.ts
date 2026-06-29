import {AccessTokenPayload, JsonUtil, OAuthUtil, StringUtil, UrlUtil} from "zavadil-ts-common";
import {AccessTokensRestClient} from "./AccessTokensRestClient";

const TOKEN_URL_NAME = 't';
const TOKEN_STORAGE_NAME = 'om-access-token';

/**
 * Manages refresh of access tokens.
 */
export class AccessTokenManager {

	onLogout: () => any;

	accessToken?: AccessTokenPayload;

	accessTokensClient: AccessTokensRestClient;

	constructor(baseUrl: string, onLogout: () => any) {
		this.onLogout = onLogout;
		this.accessTokensClient = new AccessTokensRestClient(baseUrl)
	}

	redirectTo(url: string): Promise<any> {
		document.location.href = url;
		return Promise.reject(`Redirecting to ${url}`);
	}

	hasValidAccessToken(): boolean {
		return OAuthUtil.isValidToken(this.accessToken);
	}

	verifyAccessToken(token: string): Promise<AccessTokenPayload> {
		return this.accessTokensClient.verifyAccessToken(token);
	}

	setAccessToken(token?: AccessTokenPayload) {
		this.accessToken = token;
		const raw = token ? JSON.stringify(token) : null;
		if (raw === null) {
			localStorage.removeItem(TOKEN_STORAGE_NAME);
		} else {
			localStorage.setItem(TOKEN_STORAGE_NAME, raw);
		}
	}

	/**
	 * Attempts to get access token from URL or storage.
	 * If successful returns AccessTokenPayload. If fails, promise is rejected.
	 */
	async initialize(): Promise<AccessTokenPayload> {
		const urlToken = UrlUtil.extractParamFromUrl(document.location.toString(), TOKEN_URL_NAME);
		const thisUrl = UrlUtil.deleteParamFromUrl(document.location.toString(), TOKEN_URL_NAME);
		if (StringUtil.notBlank(urlToken)) {
			try {
				const accessToken = await this.verifyAccessToken(urlToken);
				this.setAccessToken(accessToken);
				return this.redirectTo(thisUrl);
			} catch (e) {
				console.log(e);
				return this.redirectTo(thisUrl);
			}
		}

		const storageToken = JsonUtil.parse(localStorage.getItem(TOKEN_STORAGE_NAME));
		if (OAuthUtil.isValidToken(storageToken)) {
			this.accessToken = storageToken;
			return Promise.resolve(storageToken);
		}

		return Promise.reject('No existing token');
	}

	async getAccessToken(): Promise<AccessTokenPayload> {
		if (this.accessToken && this.hasValidAccessToken()) {
			if (OAuthUtil.isTokenReadyForRefresh(this.accessToken)) {
				try {
					const t = await this.accessTokensClient
						.renewAccessToken(this.accessToken.token);
					this.setAccessToken(t);
					return t;
				} catch (e) {
					this.logOut();
					return Promise.reject('Obnova tokenu selhala!');
				}
			}
			return Promise.resolve(this.accessToken);
		}

		this.logOut();
		return Promise.reject('Platnost přihlášení vypršela!');

	}

	async getAccessTokenRaw(): Promise<string> {
		const t = await this.getAccessToken();
		return t.token;
	}

	async logIn(login: string, password: string): Promise<AccessTokenPayload> {
		this.setAccessToken(undefined);
		const t = await this.accessTokensClient
			.requestAccessTokenFromLogin(login, password);
		this.setAccessToken(t);
		return t;
	}

	logOut() {
		this.setAccessToken(undefined);
		this.onLogout()
	}

}
