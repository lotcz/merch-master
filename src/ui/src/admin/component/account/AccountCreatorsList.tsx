import {useCallback, useContext, useEffect, useState} from "react";
import {TablePlaceholder} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import {Creator} from "../../../shared/types/Creator";
import {useAdminNavigator} from "../../navigator/AdminNavigator";

export type AccountCreatorsListProps = {
	accountId: number;
};

export default function AccountCreatorsList({accountId}: AccountCreatorsListProps) {
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<Creator>>();

	const load = useCallback(() => {
		restClient.creators
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
				<Button variant="primary" size="sm" onClick={() => navigator.accounts.creators.add(accountId)}>
					+ Add
				</Button>
			</div>
			<div className="pt-2">
				<Table hover={true} striped={true}>
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Email</th>
						<th>State</th>
					</tr>
					</thead>
					<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={4}>Nothing.</td>
						</tr>
					) : (
						data.map((c, index) => {
							return (
								<tr key={index} role="button" onClick={() => navigator.accounts.creators.detail(c.id)}>
									<td>{c.id}</td>
									<td>{c.user.name}</td>
									<td>{c.user.email}</td>
									<td>{c.userState}</td>
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
