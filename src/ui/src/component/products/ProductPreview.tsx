import {Spinner} from "react-bootstrap";
import {Link} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Product} from "../../types/Product";

export type ProductPreviewParams = {
	productId: number;
}

export default function ProductPreview({productId}: ProductPreviewParams) {
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Product>();

	const reload = useCallback(
		() => {
			setData(undefined);
			if (productId) {
				restClient.products.loadSingle(productId)
					.then(setData)
					.catch((e: Error) => userAlerts.err(e))
			}
		},
		[productId, restClient, userAlerts]
	);

	useEffect(reload, [productId]);

	if (!data) {
		return <Spinner/>
	}

	return (
		<Link to={`/products/detail/${productId}`}>{data.name}</Link>
	)
}
