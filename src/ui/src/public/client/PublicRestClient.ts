import {createContext, useContext} from "react";
import {EnumerationsClient} from "./EnumerationsClient";
import OmPublicRestClient from "../../shared/client/OmPublicRestClient";

/**
 * Client for public - all endpoints should be unprotected
 */
export class PublicRestClient extends OmPublicRestClient {

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
