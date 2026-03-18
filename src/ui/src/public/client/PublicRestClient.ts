import conf from "../../shared/config/conf.json";
import {RestClient} from "zavadil-ts-common";
import {createContext, useContext} from "react";
import {EnumerationsClient} from "./EnumerationsClient";

/**
 * Client for public - all endpoints should be unprotected
 */
export class PublicRestClient extends RestClient {

	enumerations: EnumerationsClient;

	constructor() {
		super(conf.API_URL);

		this.enumerations = new EnumerationsClient(this);
	}


}

export const PublicRestClientContext = createContext(new PublicRestClient());

export function usePublicRestClient(): PublicRestClient {
	return useContext(PublicRestClientContext);
}
