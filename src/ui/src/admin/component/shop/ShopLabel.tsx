import {Spinner} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {ShopBase} from "../../../shared/types/Shop";

export type ShopLabelParams = {
	shopId?: number;
	shop?: ShopBase;
};

export default function ShopLabel({shopId, shop}: ShopLabelParams) {
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<ShopBase>();

	useEffect(
		() => {
			if (shop) {
				setData(shop);
				return;
			}
			if (shopId) {
				restClient.shops.loadSingleStub(shopId).then(setData).catch((e) => userAlerts.err(e));
			}
		},
		[shopId, shop]
	);

	if (!data) {
		return <Spinner size="sm"/>;
	}

	return <div
		className="p-1 rounded"
		style={{backgroundColor: data.brandBgColor, color: data.brandFgColor}}
	>
		{data.name}
	</div>
}
