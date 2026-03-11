import {useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {TablePlaceholder} from "zavadil-react-common";
import {AdminRestClientContext} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import {Shop} from "../../../shared/types/Shop";

export type AccountShopsListProps = {
	accountId: number;
};

export default function AccountShopsList({accountId}: AccountShopsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(AdminRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<Shop>>();

	const navigateToDetail = (s: Shop) => {
		navigate(`/admin/shops/detail/${s.id}`);
	};

	const load = useCallback(() => {
		restClient.shops
			.loadByAccount(accountId)
			.then(setData)
			.catch((e: Error) => {
				setData(undefined);
				userAlerts.err(e);
			});
	}, [accountId, restClient, userAlerts]);

	useEffect(load, [accountId]);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<Button variant="primary" size="sm" onClick={() => navigate(`/admin/shops/detail/add/${accountId}`)}>
					+ Add
				</Button>
			</div>
			<div className="pt-2">
				<Table hover={true} striped={true}>
					<thead>
					<tr>
						<th>ID</th>
						<th>Slug</th>
						<th>Name</th>
						<th>State</th>
					</tr>
					</thead>
					<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={4}>Nothing.</td>
						</tr>
					) : (
						data.map((shop, index) => {
							return (
								<tr key={index} role="button" onClick={() => navigateToDetail(shop)}>
									<td>{shop.id}</td>
									<td>{shop.slug}</td>
									<td>{shop.name}</td>
									<td>{shop.state}</td>
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
