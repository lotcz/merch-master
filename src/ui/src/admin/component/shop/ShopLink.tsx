import {Link} from "react-router";
import {ShopBase} from "../../../shared/types/Shop";
import {useAdminNavigator} from "../../navigator/AdminNavigator";
import ShopLabel from "./ShopLabel";

export type ShopPreviewParams = {
	shopId?: number;
	shop?: ShopBase;
};

export default function ShopLink({shopId, shop}: ShopPreviewParams) {
	const navigator = useAdminNavigator();

	return <Link to={navigator.shops.path.detail(shopId)}><ShopLabel shop={shop} shopId={shopId}/></Link>;
}
