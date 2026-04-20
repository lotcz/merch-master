import {useAdminRestClient} from "../../client/AdminRestClient";
import {useEffect, useState} from "react";
import {ShopStub} from "../../../shared/types/Shop";
import DesignSelect from "./DesignSelect";
import {Spinner} from "react-bootstrap";

export type DesignSelectByShopProps = {
	shopId: number;
	designId?: number | null;
	onChange: (designId?: number | null) => any;
}

export default function DesignSelectByShop({shopId, designId, onChange}: DesignSelectByShopProps) {
	const client = useAdminRestClient();
	const [shop, setShop] = useState<ShopStub | null>();

	useEffect(() => {
		if (!shopId) {
			setShop(null);
			return;
		}
		if (shop?.id !== shopId) {
			client.shops.loadSingleStub(shopId).then(setShop)
		}
	}, [shopId]);

	if (!shop) return <Spinner/>

	return <DesignSelect
		accountId={shop.accountId}
		designId={designId}
		onChange={onChange}
	/>
}
