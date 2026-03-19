import EntityNavigator from "../../shared/navigator/EntityNavigator";
import PathProvider from "../../shared/navigator/PathProvider";
import {NavigateFunction} from "react-router";
import EntityPathProvider from "../../shared/navigator/EntityPathProvider";
import {createContext, useContext} from "react";
import AdminAccountsNavigator from "./AdminAccountsNavigator";
import AdminProductsNavigator from "./AdminProductsNavigator";
import LinkNavigator from "../../shared/navigator/LinkNavigator";
import AdminShopsNavigator from "./AdminShopsNavigator";

export default class AdminNavigator extends LinkNavigator {

	dashboard: LinkNavigator;

	users: EntityNavigator;

	designs: EntityNavigator;

	products: AdminProductsNavigator;

	accounts: AdminAccountsNavigator;

	shops: AdminShopsNavigator;

	constructor(navigate: NavigateFunction) {
		super(navigate, new PathProvider('/admin'));
		this.dashboard = new LinkNavigator(navigate, new PathProvider('dashboard', this.provider));
		this.users = new EntityNavigator(navigate, new EntityPathProvider('users', this.provider));
		this.designs = new EntityNavigator(navigate, new EntityPathProvider('designs', this.provider));
		this.products = new AdminProductsNavigator(this);
		this.accounts = new AdminAccountsNavigator(this);
		this.shops = new AdminShopsNavigator(this);
	}

}

export const AdminNavigatorContext = createContext<AdminNavigator | undefined>(undefined);

export function useAdminNavigator(): AdminNavigator {
	const ctx = useContext(AdminNavigatorContext);
	if (!ctx) throw new Error("useAdminNavigator must be used within AdminApp!");
	return ctx;
}
