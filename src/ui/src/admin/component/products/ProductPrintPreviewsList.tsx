import {useCallback, useContext, useEffect, useState} from "react";
import {TablePlaceholder} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import {PrintPreviewStub} from "../../../shared/types/PrintPreview";
import {useAdminNavigator} from "../../navigator/AdminNavigator";

export type ProductPrintPreviewsListProps = {
	productId: number;
};

export default function ProductPrintPreviewsList({productId}: ProductPrintPreviewsListProps) {
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<PrintPreviewStub>>();

	const load = useCallback(() => {
		restClient.printPreviews
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
				<Button variant="primary" size="sm" onClick={() => navigator.products.printPreviews.add(productId)}>
					+ Add
				</Button>
			</div>
			<div className="pt-2">
				<Table hover={true} striped={true}>
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
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
								<tr key={index} role="button" onClick={() => navigator.products.printPreviews.detail(pt.id)}>
									<td>{pt.id}</td>
									<td>{pt.name}</td>
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
