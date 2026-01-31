import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {TablePlaceholder} from "zavadil-react-common";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Button, Table} from "react-bootstrap";
import {PrintZoneStub} from "../../types/PrintZone";

export type ProductPrintZonesListProps = {
	productId: number;
}

export default function ProductPrintZonesList({productId}: ProductPrintZonesListProps) {
	const navigate = useNavigate();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Array<PrintZoneStub>>();

	const navigateToDetail = (d: PrintZoneStub) => {
		navigate(`/products/print-zones/detail/${d.id}`);
	}

	const load = useCallback(
		() => {
			restClient
				.printZones
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
					onClick={() => navigate(`/products/print-zones/detail/add/${productId}`)}>
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
						<th>Size</th>
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
										<td>{pt.widthMm} x {pt.heightMm} mm</td>
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
