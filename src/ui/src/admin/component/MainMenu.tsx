import {useCallback, useContext} from "react";
import {NavLink} from "react-router";
import {UserAlertsContext} from "../../shared/util/UserAlerts";
import {Localize} from "zavadil-react-common";
import {useAdminRestClient} from "../client/AdminRestClient";
import {useAdminNavigator} from "../navigator/AdminNavigator";

function MainMenu() {
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);

	const logOut = useCallback(() => {
		restClient.logout().then(() => {
			userAlerts.info("Logged out");
			navigator.dashboard.go();
		});
	}, [navigator, restClient, userAlerts]);

	return (
		<div className="main-menu p-3">
			<h4 className="mt-2">Manage</h4>
			<div className="ps-3">
				<div>
					<NavLink to={navigator.products.path.list()}>Products</NavLink>
				</div>
				<div>
					<NavLink to={navigator.accounts.path.list()}>Accounts</NavLink>
				</div>
				<div>
					<NavLink to={navigator.users.path.list()}>Users</NavLink>
				</div>
				<div>
					<NavLink to={navigator.shops.path.list()}>Shops</NavLink>
				</div>
				<div>
					<NavLink to={navigator.designs.path.list()}>Designs</NavLink>
				</div>
			</div>
			<h4 className="mt-2">
				<Localize text="System"/>
			</h4>
			<div className="ps-3">
				<div className="text-nowrap">
					<NavLink to={navigator.dashboard.path()}>
						<Localize text="System State"/>
					</NavLink>
				</div>
				<div>
					<NavLink to="/creator">
						<Localize text="Creator"/>
					</NavLink>
				</div>
				<div>
					<NavLink to="/">
						<Localize text="Website"/>
					</NavLink>
				</div>
				<div>
					<a
						href="/"
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							logOut();
						}}
					>
						<Localize text="Log out"/>
					</a>
				</div>
			</div>
		</div>
	);
}

export default MainMenu;
