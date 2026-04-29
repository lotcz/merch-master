import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {Button, Form} from "react-bootstrap";
import {Page, PagingRequest} from "zavadil-ts-common";
import {useAdminNavigator} from "../../navigator/AdminNavigator";
import {ShopOrder} from "../../../shared/types/ShopOrder";

const HEADER: SelectableTableHeader<ShopOrder> = [
	{name: "orderState", label: "State"},
	{name: "totalPrice", label: "Price"},
	{name: "lastUpdatedOn", label: "Updated", renderer: (p) => <DateTime value={p.lastUpdatedOn}/>},
	{name: "createdOn", label: "Created", renderer: (p) => <DateTime value={p.createdOn}/>},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: "lastUpdatedOn", desc: true}]};

export type ShopCustomerOrderListProps = {
	customerId: number;
};

export default function ShopCustomerOrdersList({customerId}: ShopCustomerOrderListProps) {
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<ShopOrder>>();
	const [searchInput, setSearchInput] = useState<string>('');
	const [paging, setPaging] = useState<PagingRequest>(DEFAULT_PAGING);

	const load = useCallback(() => {
		restClient.shopOrders
			.loadByCustomer(customerId, paging)
			.then(setData)
			.catch((e: Error) => {
				setData(undefined);
				userAlerts.err(e);
			});
	}, [customerId, paging, restClient, userAlerts]);

	useEffect(load, [customerId, paging]);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			setPaging({...paging});
		},
		[paging, searchInput],
	);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<Button variant="primary" size="sm" onClick={() => navigator.orders.add(customerId)}>
					+ Add
				</Button>
				<div style={{width: "250px"}}>
					<Form onSubmit={applySearch}>
						<TextInputWithReset
							value={searchInput}
							onChange={setSearchInput}
							onReset={() => {
								setSearchInput("");
								setPaging(DEFAULT_PAGING);
							}}
						/>
					</Form>
				</div>
				<Button onClick={applySearch} size="sm">Search</Button>
			</div>
			<div className="pt-2">
				<TableWithSelect
					showSelect={false}
					header={HEADER}
					paging={paging}
					totalItems={data.totalItems}
					onPagingChanged={setPaging}
					onClick={(item) => navigator.orders.detail(item.id)}
					items={data.content}
					hover={true}
					striped={true}
				/>
			</div>
		</div>
	);
}
