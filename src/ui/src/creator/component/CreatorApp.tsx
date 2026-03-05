import "../style/creator.less";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OAuthRefreshTokenProvider, RefreshTokenPayload } from "zavadil-ts-common";
import { LoadingPage } from "../../shared/component/LoadingPage";
import { CreatorRestClient, CreatorRestClientContext } from "../client/CreatorRestClient";
import CreatorMain from "./CreatorMain";
import LoginPage, { RefreshTokenSetter } from "./LoginPage";

type RefreshTokenPromise = Promise<RefreshTokenPayload>;
type RefreshTokenGetter = () => RefreshTokenPromise;

class LoginFormTokenProvider implements OAuthRefreshTokenProvider {
	private getToken: RefreshTokenGetter;

	constructor(getToken: RefreshTokenGetter) {
		this.getToken = getToken;
	}

	getRefreshToken(): Promise<RefreshTokenPayload> {
		return this.getToken();
	}

	reset(): Promise<any> {
		return Promise.resolve();
	}
}

export default function CreatorApp() {
	const [logged, setLogged] = useState<boolean | undefined>();

	const tokenResolverRef = useRef<RefreshTokenSetter>((t) => {
		setLogged(true);
	});

	const onTokenObtained = useCallback((t: RefreshTokenPayload) => {
		tokenResolverRef.current?.(t);
		setLogged(true);
	}, []);

	const refreshTokenProvider: OAuthRefreshTokenProvider = useMemo(() => {
		const getToken: RefreshTokenGetter = () => {
			setLogged(false);
			const promise = new Promise<RefreshTokenPayload>((resolve) => {
				tokenResolverRef.current = resolve;
			});
			return promise;
		};
		return new LoginFormTokenProvider(getToken);
	}, []);

	const restClient = useMemo(() => new CreatorRestClient(refreshTokenProvider), [refreshTokenProvider]);

	const restInitialize = useCallback(() => {
		setLogged(undefined);
		restClient
			.initialize()
			.then(() => setLogged(true))
			.catch((e) => {
				setLogged(false);
			});
	}, [restClient]);

	useEffect(() => restInitialize, []);

	return (
		<CreatorRestClientContext.Provider value={restClient}>
			<div>
				{logged === undefined && <LoadingPage />}
				{logged === false && <LoginPage onRefreshTokenObtained={onTokenObtained} />}
				{logged === true && <CreatorMain />}
			</div>
		</CreatorRestClientContext.Provider>
	);
}
