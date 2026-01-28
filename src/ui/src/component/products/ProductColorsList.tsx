import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {DateTime, TablePlaceholder} from "zavadil-react-common";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import ColorPreview from "../productColor/ColorPreview";
import {ProductColorStub} from "../../types/ProductColor";

export type ProductColorsListProps = {
	productId: number;
}

export default function ProductColorsList({productId}: ProductColorsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<ProductColorStub>>();

	const navigateToDetail = (d: ProductColorStub) => {
		navigate(`/products/product-colors/detail/${d.id}`);
	}

	const load = useCallback(
		() => {
			restClient
				.productColors
				.loadByProduct(productId)
				.then(setData)
				.catch((e: Error) => {
					setData(undefined);
					userAlerts.err(e);
				});
		},
		[productId, restClient, userAlerts]
	);

	useEffect(load, [productId]);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<Button
					variant="primary"
					onClick={() => navigate(`/products/product-colors/detail/add/${productId}`)}>
					+ Add
				</Button>
			</div>
			<div className="pt-2">
				<Table
					hover={true}
					striped={true}
				>
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Updated</th>
						<th>Created</th>
					</tr>
					</thead>
					<tbody>
					{
						(data.length === 0) ? <tr>
								<td colSpan={4}>Nothing.</td>
							</tr> :
							data.map((pt, index) => {
								return (
									<tr key={index} role="button" onClick={() => navigateToDetail(pt)}>
										<td>{pt.id}</td>
										<td><ColorPreview color={pt}/></td>
										<td><DateTime value={pt.lastUpdatedOn}/></td>
										<td><DateTime value={pt.createdOn}/></td>
									</tr>
								);
							})
					}
					</tbody>
				</Table>
			</div>
		</div>
	);
}
