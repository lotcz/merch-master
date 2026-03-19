import EntityNavigator from "../../shared/navigator/EntityNavigator";
import EntityPathProvider from "../../shared/navigator/EntityPathProvider";
import AdminNavigator from "./AdminNavigator";

export default class AdminAccountsNavigator extends EntityNavigator {

	creators: EntityNavigator;

	shops: EntityNavigator;

	imageCache: EntityNavigator;

	constructor(admin: AdminNavigator) {
		super(admin.navigate, new EntityPathProvider('accounts', admin.provider));
		this.creators = new EntityNavigator(admin.navigate, new EntityPathProvider('creators', this.path));
		this.imageCache = new EntityNavigator(admin.navigate, new EntityPathProvider('image-cache', this.path));
		this.shops = new EntityNavigator(admin.navigate, new EntityPathProvider('shops', admin.provider));
	}
}
