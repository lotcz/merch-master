import EntityNavigator from "../EntityNavigator";
import EntityPathProvider from "../EntityPathProvider";
import AdminNavigator from "./AdminNavigator";

export default class AdminShopsNavigator extends EntityNavigator {

	imageCache: EntityNavigator;

	products: EntityNavigator;

	categories: EntityNavigator;

	customers: EntityNavigator;

	constructor(admin: AdminNavigator) {
		super(admin.navigate, new EntityPathProvider('shops', admin.provider));
		this.imageCache = new EntityNavigator(admin.navigate, new EntityPathProvider('image-cache', this.path));
		this.products = new EntityNavigator(admin.navigate, new EntityPathProvider('products', this.path));
		this.categories = new EntityNavigator(admin.navigate, new EntityPathProvider('categories', this.path));
		this.customers = new EntityNavigator(admin.navigate, new EntityPathProvider('customers', this.path));
	}
}
