import {useCallback, useContext, useEffect, useState} from "react";
import {DateTime, TablePlaceholder} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import ColorPreview from "../../../../shared/component/productColor/ColorPreview";
import {ProductColorStub} from "../../../../shared/types/ProductColor";
import {useNavigator} from "../../../../shared/navigator/OmAppNavigator";

export type ProductColorsListProps = {
	productId: number;
};

export default function ProductColorsList({productId}: ProductColorsListProps) {
	const navigator = useNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<ProductColorStub>>();

	const load = useCallback(() => {
		restClient.productColors
			.loadByProduct(productId)
			.then(setData)
			.catch((e: Error) => {
				setData(undefined);
				userAlerts.err(e);
			});
	}, [productId, restClient, userAlerts]);

	useEffect(load, [productId]);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<Button variant="primary" size="sm" onClick={() => navigator.admin.products.colors.add(productId)}>
					+ Add
				</Button>
			</div>
			<div className="pt-2">
				<Table hover={true} striped={true}>
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Updated</th>
						<th>Created</th>
					</tr>
					</thead>
					<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={4}>Nothing.</td>
						</tr>
					) : (
						data.map((pt, index) => {
							return (
								<tr key={index} role="button" onClick={() => navigator.admin.products.colors.detail(pt.id)}>
									<td>{pt.id}</td>
									<td>
										<ColorPreview color={pt}/>
									</td>
									<td>
										<DateTime value={pt.lastUpdatedOn}/>
									</td>
									<td>
										<DateTime value={pt.createdOn}/>
									</td>
								</tr>
							);
						})
					)}
					</tbody>
				</Table>
			</div>
		</div>
	);
}
