import EntityNavigator from "../../shared/navigator/EntityNavigator";
import EntityPathProvider from "../../shared/navigator/EntityPathProvider";
import AdminNavigator from "./AdminNavigator";

export default class AdminProductsNavigator extends EntityNavigator {

	printPreviews: EntityNavigator;

	printTypes: EntityNavigator;

	printZones: EntityNavigator;

	colors: EntityNavigator;

	sizes: EntityNavigator;

	constructor(admin: AdminNavigator) {
		super(admin.navigate, new EntityPathProvider('products', admin.provider));
		this.printPreviews = new EntityNavigator(admin.navigate, new EntityPathProvider('print-previews', this.path));
		this.printTypes = new EntityNavigator(admin.navigate, new EntityPathProvider('print-types', this.path));
		this.printZones = new EntityNavigator(admin.navigate, new EntityPathProvider('print-zones', this.path));
		this.colors = new EntityNavigator(admin.navigate, new EntityPathProvider('product-colors', this.path));
		this.sizes = new EntityNavigator(admin.navigate, new EntityPathProvider('product-sizes', this.path));
	}
}
