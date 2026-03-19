import EntityNavigator from "../../shared/navigator/EntityNavigator";
import EntityPathProvider from "../../shared/navigator/EntityPathProvider";
import AdminNavigator from "./AdminNavigator";

export default class AdminShopsNavigator extends EntityNavigator {

	imageCache: EntityNavigator;

	products: EntityNavigator;

	categories: EntityNavigator;

	orders: EntityNavigator;

	constructor(admin: AdminNavigator) {
		super(admin.navigate, new EntityPathProvider('shops', admin.provider));
		this.imageCache = new EntityNavigator(admin.navigate, new EntityPathProvider('image-cache', this.path));
		this.products = new EntityNavigator(admin.navigate, new EntityPathProvider('products', this.path));
		this.categories = new EntityNavigator(admin.navigate, new EntityPathProvider('categories', this.path));
		this.orders = new EntityNavigator(admin.navigate, new EntityPathProvider('orders', this.path));
	}
}
