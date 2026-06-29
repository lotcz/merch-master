import {createContext, useContext} from "react";
import {EnumerationsClient} from "./EnumerationsClient";
import OmRestClient from "../../shared/client/OmRestClient";

/**
 * Client for public - all endpoints should be unprotected
 */
export class PublicRestClient extends OmRestClient {

	enumerations: EnumerationsClient;

	constructor() {
		super();

		this.enumerations = new EnumerationsClient(this);
	}

}

export const PublicRestClientContext = createContext(new PublicRestClient());

export function usePublicRestClient(): PublicRestClient {
	return useContext(PublicRestClientContext);
}
