import "../style/creator.less";
import {useMemo} from "react";
import {CreatorRestClient, CreatorRestClientContext} from "../client/CreatorRestClient";
import CreatorMain from "./CreatorMain";
import {useSecuredRestClient} from "../../../shared/client/OmSecuredRestClient";

export default function CreatorApp() {
	const securedRestClient = useSecuredRestClient();
	const restClient = useMemo(() => new CreatorRestClient(securedRestClient), [securedRestClient]);

	return (
		<CreatorRestClientContext.Provider value={restClient}>
			<CreatorMain/>
		</CreatorRestClientContext.Provider>
	);
}
