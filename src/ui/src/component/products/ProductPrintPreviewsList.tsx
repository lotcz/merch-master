import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {TablePlaceholder} from "zavadil-react-common";
import {MerchMasterRestClientContext} from "../../client/merchMaster/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import {PrintPreviewStub} from "../../types/PrintPreview";

export type ProductPrintPreviewsListProps = {
	productId: number;
}

export default function ProductPrintPreviewsList({productId}: ProductPrintPreviewsListProps) {
	const navigate = useNavigate();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<PrintPreviewStub>>();

	const navigateToDetail = (d: PrintPreviewStub) => {
		navigate(`/products/print-previews/detail/${d.id}`);
	}

	const load = useCallback(
		() => {
			restClient
				.printPreviews
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
					size="sm"
					onClick={() => navigate(`/products/print-previews/detail/add/${productId}`)}>
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
										<td>{pt.name}</td>
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
