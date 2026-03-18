import EntityNavigator from "../../shared/navigator/EntityNavigator";
import PathProvider from "../../shared/navigator/PathProvider";
import {NavigateFunction} from "react-router";
import EntityPathProvider from "../../shared/navigator/EntityPathProvider";
import {createContext, useContext} from "react";
import AdminAccountsNavigator from "./AdminAccountsNavigator";
import AdminProductsNavigator from "./AdminProductsNavigator";
import LinkNavigator from "../../shared/navigator/LinkNavigator";

export default class AdminNavigator extends LinkNavigator {

	dashboard: LinkNavigator;

	products: AdminProductsNavigator;

	accounts: AdminAccountsNavigator;

	users: EntityNavigator;

	shops: EntityNavigator;

	designs: EntityNavigator;

	constructor(navigate: NavigateFunction) {
		super(navigate, new PathProvider('/admin'));
		this.dashboard = new LinkNavigator(navigate, new PathProvider('dashboard', this.provider));
		this.products = new AdminProductsNavigator(this);
		this.accounts = new AdminAccountsNavigator(this);
		this.users = new EntityNavigator(navigate, new EntityPathProvider('users', this.provider));
		this.shops = new EntityNavigator(navigate, new EntityPathProvider('shops', this.provider));
		this.designs = new EntityNavigator(navigate, new EntityPathProvider('designs', this.provider));
	}

}

export const AdminNavigatorContext = createContext<AdminNavigator | undefined>(undefined);

export function useAdminNavigator(): AdminNavigator {
	const ctx = useContext(AdminNavigatorContext);
	if (!ctx) throw new Error("useAdminNavigator must be used within AdminApp!");
	return ctx;
}
