import {useCallback, useContext} from "react";
import {NavLink} from "react-router";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {Localize} from "zavadil-react-common";
import {useNavigator} from "../../../shared/navigator/OmAppNavigator";
import {useSecuredRestClient} from "../../../shared/client/OmSecuredRestClient";

function AdminMainMenu() {
	const navigator = useNavigator();
	const restClient = useSecuredRestClient();
	const userAlerts = useContext(UserAlertsContext);

	const logOut = useCallback(() => restClient.logOut(), [restClient]);

	return (
		<div className="main-menu p-3">
			<h4 className="mt-2">Manage</h4>
			<div className="ps-3">
				<div>
					<NavLink to={navigator.admin.products.path.list()}>Products</NavLink>
				</div>
				<div>
					<NavLink to={navigator.admin.accounts.path.list()}>Accounts</NavLink>
				</div>
				<div>
					<NavLink to={navigator.admin.users.path.list()}>Users</NavLink>
				</div>
				<div>
					<NavLink to={navigator.admin.shops.path.list()}>Shops</NavLink>
				</div>
				<div>
					<NavLink to={navigator.admin.orders.path.list()}>Orders</NavLink>
				</div>
				<div>
					<NavLink to={navigator.admin.designs.path.list()}>Designs</NavLink>
				</div>
			</div>
			<h4 className="mt-2">
				<Localize text="System"/>
			</h4>
			<div className="ps-3">
				<div className="text-nowrap">
					<NavLink to={navigator.admin.dashboard.path()}>
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
						href="/src/public"
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

export default AdminMainMenu;
