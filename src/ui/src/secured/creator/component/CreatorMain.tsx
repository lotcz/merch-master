import {useCallback} from "react";
import {Button} from "react-bootstrap";
import {NavLink} from "react-router";
import {Localize} from "zavadil-react-common";
import {useSecuredRestClient} from "../../../shared/client/OmSecuredRestClient";

export default function CreatorMain() {
	const restClient = useSecuredRestClient();

	const logOut = useCallback(() => restClient.logOut(), [restClient]);

	return (
		<div>
			<h1>Creator</h1>
			Logged in, main
			<div>
				<NavLink to="/admin">
					<Localize text="Admin"/>
				</NavLink>
			</div>
			<div>
				<NavLink to="/">
					<Localize text="Website"/>
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
