import {Form, Spinner, Stack} from "react-bootstrap";
import {useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import {useAdminNavigator} from "../../navigator/AdminNavigator";
import {ShopOrderStub} from "../../../shared/types/ShopOrder";
import ShopCustomerSelect from "../shopCustomer/ShopCustomerSelect";
import OrderStateSelect from "./OrderStateSelect";

export default function ShopOrderDetail() {
	const {id, customerId} = useParams();
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<ShopOrderStub>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const onChanged = useCallback(() => {
		if (!data) return;
		setData({...data});
		setChanged(true);
	}, [data]);

	const reload = useCallback(() => {
		if (!id) {
			setData({
				customerId: Number(customerId),
				orderState: "Pending",
				totalPrice: 0,
				useShippingAddress: true
			});
			return;
		}
		setData(undefined);
		restClient.shopOrders
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, customerId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.shopOrders
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigator.shops.orders.detail(f.id, true);
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, userAlerts, navigator]);

	const deleteOrder = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this order?", () => {
			setDeleting(true);
			restClient.shopOrders
				.delete(Number(data.id))
				.then((f) => {
					navigator.shops.orders.list();
				})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setDeleting(false));
		});
	}, [restClient, data, userAlerts, navigator, confirmDialog]);

	if (!data) {
		return <Spinner/>;
	}

	return (
		<div>
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton loading={saving} disabled={!changed} onClick={saveData}>
						Save
					</SaveButton>
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteOrder}>
						Delete
					</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>

					<ShopCustomerSelect
						customerId={data.customerId}
						onChange={(e) => {
							data.customerId = Number(e);
							onChanged();
						}}
					/>

					<FormRow label="Description">
						<OrderStateSelect
							state={data.orderState}
							onChange={(e) => {
								data.orderState = e;
								onChanged();
							}}
						/>
					</FormRow>
				</Stack>
			</Form>
		</div>
	);
}
