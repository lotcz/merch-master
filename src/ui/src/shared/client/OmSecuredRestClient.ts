import conf from "../config/conf.json";
import {AccessTokenPayload} from "zavadil-ts-common";
import {AccessTokenManager} from "./AccessTokenManager";
import OmRestClient from "./OmRestClient";
import {createContext, useContext} from "react";
import {User} from "../types/User";

export default class OmSecuredRestClient extends OmRestClient {

	tokenManager: AccessTokenManager;

	constructor(onLogout: () => any) {
		super();
		this.tokenManager = new AccessTokenManager(conf.API_URL, onLogout);
	}

	initialize(): Promise<AccessTokenPayload> {
		return this.tokenManager.initialize();
	}

	logIn(login: string, password: string): Promise<AccessTokenPayload> {
		return this.tokenManager.logIn(login, password);
	}

	logOut() {
		return this.tokenManager.logOut();
	}

	profile(): Promise<User> {
		return this.getJson('users/profile');
	}

	changeMyPassword(password: string): Promise<any> {
		return this.put('users/profile/password', password);
	}

	getHeaders(endpoint: string): Promise<Headers> {
		return this.tokenManager.getAccessTokenRaw()
			.then((accessToken) =>
				super.getHeaders(endpoint).then((headers) => {
					headers.set("Authorization", `Bearer ${accessToken}`);
					return headers;
				}),
			);
	}

}

export const SecuredRestClientContext = createContext<OmSecuredRestClient | undefined>(undefined);

export function useSecuredRestClient(): OmSecuredRestClient {
	const securedClient = useContext(SecuredRestClientContext);
	if (!securedClient) throw new Error("useSecuredRestClient must be used within SecuredApp!");
	return securedClient;
}
