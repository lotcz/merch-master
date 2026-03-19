import {Spinner} from "react-bootstrap";
import {Link} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {ShopStub} from "../../../shared/types/Shop";
import {useAdminNavigator} from "../../navigator/AdminNavigator";

export type ShopPreviewParams = {
	shopId: number;
};

export default function ShopPreview({shopId}: ShopPreviewParams) {
	const restClient = useAdminRestClient();
	const navigator = useAdminNavigator();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<ShopStub>();

	const reload = useCallback(() => {
		setData(undefined);
		if (shopId) {
			restClient.shops
				.loadSingleStub(shopId)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		}
	}, [shopId, restClient, userAlerts]);

	useEffect(reload, [shopId]);

	if (!data) {
		return <Spinner/>;
	}

	return <Link to={navigator.shops.path.detail(shopId)}>{data.name}</Link>;
}
