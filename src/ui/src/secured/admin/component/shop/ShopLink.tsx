import {Link} from "react-router";
import {ShopBase} from "../../../../shared/types/Shop";
import ShopLabel from "./ShopLabel";
import {useNavigator} from "../../../../shared/navigator/OmAppNavigator";

export type ShopPreviewParams = {
	shopId?: number;
	shop?: ShopBase;
};

export default function ShopLink({shopId, shop}: ShopPreviewParams) {
	const navigator = useNavigator();

	return <Link to={navigator.admin.shops.path.detail(shopId)}><ShopLabel shop={shop} shopId={shopId}/></Link>;
}
