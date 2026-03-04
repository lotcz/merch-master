import { createContext, useContext } from "react";
import { OAuthRefreshTokenProvider } from "zavadil-ts-common";
import { MmRestClient } from "../../shared/client/MmRestClient";

export class CreatorRestClient extends MmRestClient {
	constructor(onRefreshTokenRequested: OAuthRefreshTokenProvider) {
		super(onRefreshTokenRequested, "creator", "admin:creator/*");
	}

	test(): Promise<string> {
		return this.get("user").then((r) => r.text());
	}
}

export const CreatorRestClientContext = createContext<CreatorRestClient | undefined>(undefined);

export function useCreatorRestClient(): CreatorRestClient {
	const ctx = useContext(CreatorRestClientContext);
	if (!ctx) throw new Error("useCreatorRestClient must be used within CreatorApp!");
	return ctx;
}
