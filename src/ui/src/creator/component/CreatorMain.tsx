import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router";
import { Localize } from "zavadil-react-common";
import { CreatorRestClient, CreatorRestClientContext, useCreatorRestClient } from "../client/CreatorRestClient";

export default function CreatorMain() {
	const restClient = useCreatorRestClient();

	const logOut = useCallback(() => restClient.logout(), [restClient]);

	return (
		<div>
			<h1>Creator</h1>
			Logged in, main
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
			<div>
				<Button variant="link" onClick={logOut}>
					Log out
				</Button>
			</div>
		</div>
	);
}
