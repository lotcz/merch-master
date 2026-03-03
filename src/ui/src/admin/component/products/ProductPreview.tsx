import { Spinner } from "react-bootstrap";
import { Link } from "react-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AdminRestClientContext } from "../../client/AdminRestClient";
import { UserAlertsContext } from "../../../shared/util/UserAlerts";
import { Product } from "../../../shared/types/Product";

export type ProductPreviewParams = {
	productId: number;
};

export default function ProductPreview({ productId }: ProductPreviewParams) {
	const restClient = useContext(AdminRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Product>();

	const reload = useCallback(() => {
		setData(undefined);
		if (productId) {
			restClient.products
				.loadSingle(productId)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		}
	}, [productId, restClient, userAlerts]);

	useEffect(reload, [productId]);

	if (!data) {
		return <Spinner />;
	}

	return <Link to={`/products/detail/${productId}`}>{data.name}</Link>;
}
