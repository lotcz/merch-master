import EntityNavigator from "../EntityNavigator";
import PathProvider from "../PathProvider";
import {NavigateFunction} from "react-router";
import EntityPathProvider from "../EntityPathProvider";
import AdminAccountsNavigator from "./AdminAccountsNavigator";
import AdminProductsNavigator from "./AdminProductsNavigator";
import LinkNavigator from "../LinkNavigator";
import AdminShopsNavigator from "./AdminShopsNavigator";

export default class AdminNavigator extends LinkNavigator {

	dashboard: LinkNavigator;

	users: EntityNavigator;

	designs: EntityNavigator;

	products: AdminProductsNavigator;

	accounts: AdminAccountsNavigator;

	shops: AdminShopsNavigator;

	orders: EntityNavigator;

	constructor(navigate: NavigateFunction) {
		super(navigate, new PathProvider('/admin'));
		this.dashboard = new LinkNavigator(navigate, new PathProvider('dashboard', this.provider));
		this.users = new EntityNavigator(navigate, new EntityPathProvider('users', this.provider));
		this.designs = new EntityNavigator(navigate, new EntityPathProvider('designs', this.provider));
		this.products = new AdminProductsNavigator(this);
		this.accounts = new AdminAccountsNavigator(this);
		this.shops = new AdminShopsNavigator(this);
		this.orders = new EntityNavigator(navigate, new EntityPathProvider('orders', this.provider));
	}

}
