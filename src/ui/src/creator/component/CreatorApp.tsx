import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { Localize } from "zavadil-react-common";
import { CreatorRestClient, CreatorRestClientContext } from "../client/CreatorRestClient";

export default function CreatorApp() {
	const restClient = useMemo(() => new CreatorRestClient(), []);
	const [logged, setLogged] = useState<boolean>(false);

	useEffect(() => {
		restClient
			.test()
			.then((r) => setLogged(true))
			.catch((r) => setLogged(false));
	}, [restClient]);

	return (
		<CreatorRestClientContext.Provider value={restClient}>
			<div>
				<h1>Creator</h1>
				<div>{logged ? "Logged" : "Anonym"}</div>
				<div>
					<NavLink to="/admin">
						<Localize text="Admin" />
					</NavLink>
				</div>
				<div>
					<NavLink to="/">
						<Localize text="Website" />
					</NavLink>
				</div>
			</div>
		</CreatorRestClientContext.Provider>
	);
}
