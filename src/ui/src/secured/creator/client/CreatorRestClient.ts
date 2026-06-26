import {createContext, useContext} from "react";
import OmSecuredRestClient from "../../../shared/client/OmSecuredRestClient";

export class CreatorRestClient {
	client: OmSecuredRestClient

	constructor(client: OmSecuredRestClient) {
		this.client = client;
	}

	test(): Promise<string> {
		return this.client.get("user").then((r) => r.text());
	}
}

export const CreatorRestClientContext = createContext<CreatorRestClient | undefined>(undefined);

export function useCreatorRestClient(): CreatorRestClient {
	const ctx = useContext(CreatorRestClientContext);
	if (!ctx) throw new Error("useCreatorRestClient must be used within CreatorApp!");
	return ctx;
}
