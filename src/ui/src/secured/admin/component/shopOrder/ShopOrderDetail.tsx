import {Button, Form, Spinner, Stack, Table} from "react-bootstrap";
import {useParams} from "react-router";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../../shared/component/general/BackIconLink";
import {ShopOrderStub} from "../../../../shared/types/ShopOrder";
import OrderStateSelect from "./OrderStateSelect";
import {ShopOrderItemStub} from "../../../../shared/types/ShopOrderItem";
import ShopCustomerByShopSelect from "../shopCustomer/ShopCustomerByShopSelect";
import ShopSelect from "../shop/ShopSelect";
import ShopOrderItemForm from "./ShopOrderItemForm";
import {useNavigator} from "../../../../shared/navigator/OmAppNavigator";
import Money from "../../../../shared/component/general/Money";

export default function ShopOrderDetail() {
	const {id, customerId} = useParams();
	const navigator = useNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [shopId, setShopId] = useState<number | null>();
	const [data, setData] = useState<ShopOrderStub>();
	const [items, setItems] = useState<Array<ShopOrderItemStub>>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const onChanged = useCallback(() => {
		if (!data) return;
		setData({...data});
		setChanged(true);
	}, [data]);

	const shopCustomerId = useMemo(() => data?.customerId, [data]);

	const recalculate = useCallback(() => {
		if (!data) return;
		if (!items) return;
		const totalPrice = items.reduce(
			(prev, current) => prev + (current.unitCount * current.unitPrice),
			0
		);
		if (data.totalPrice !== totalPrice) {
			data.totalPrice = totalPrice;
			onChanged();
		}
	}, [items, onChanged, data]);

	useEffect(
		() => {
			if (shopCustomerId) {
				restClient.shopCustomers
					.loadSingleStub(shopCustomerId)
					.then((c) => setShopId(c.shopId));
			}
		},
		[shopCustomerId]
	);

	const reload = useCallback(
		() => {
			setChanged(false);
			if (!id) {
				setData(
					{
						customerId: Number(customerId),
						orderState: "Pending",
						totalPrice: 0,
						useShippingAddress: true
					}
				);
				setItems([]);
				return;
			}
			setData(undefined);
			restClient.shopOrders
				.loadSingleStub(Number(id))
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
			restClient.shopOrders.loadItems(Number(id))
				.then(setItems)
				.catch((e: Error) => {
					setItems(undefined);
					userAlerts.err(e);
				});
		},
		[id, customerId, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!(data && items)) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.shopOrders
			.saveStub(data)
			.then((updatedOrder) => {
				const itemsForUpdate = items
					.filter((i) => i.productId > 0)
					.map((i) => {
						return {...i, orderId: Number(updatedOrder.id)}
					});
				restClient.shopOrders
					.updateItems(Number(updatedOrder.id), itemsForUpdate)
					.then(
						(updatedItems) => {
							if (inserting) {
								navigator.admin.orders.detail(updatedOrder.id, true);
							} else {
								setData(updatedOrder);
								setItems(updatedItems);
							}
							setChanged(false);
						}
					)
					.catch((e: Error) => userAlerts.err(e));
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, items, userAlerts, navigator]);

	const deleteOrder = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this order?", () => {
			setDeleting(true);
			restClient.shopOrders
				.delete(Number(data.id))
				.then((f) => {
					navigator.admin.orders.list();
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

					<FormRow label="Shop">
						<ShopSelect
							shopId={shopId}
							onChange={setShopId}
						/>
					</FormRow>

					<FormRow label="Customer">
						<ShopCustomerByShopSelect
							shopId={Number(shopId)}
							disabled={shopId === undefined || shopId === null}
							customerId={data.customerId}
							onChange={(e) => {
								data.customerId = Number(e);
								onChanged();
							}}
						/>
					</FormRow>

					<FormRow label="State">
						<div className="float-start">
							<OrderStateSelect
								state={data.orderState}
								onChange={(e) => {
									data.orderState = e;
									onChanged();
								}}
							/>
						</div>
					</FormRow>

					{
						items && <div>
							<h2>
								Items
							</h2>

							<Stack direction="horizontal" gap={2}>
								<Button
									size="sm"
									onClick={
										() => {
											const newItem: ShopOrderItemStub = {orderId: Number(data.id), unitPrice: 0, unitCount: 1, productId: 0};
											setItems([...items, newItem]);
										}
									}
								>+ Add</Button>
							</Stack>

							<Table>
								<thead>
								<tr>
									<th>Product</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Total Price</th>
								</tr>
								</thead>
								<tbody>
								{
									shopId && items.map(
										(item, index) => <ShopOrderItemForm
											key={index}
											shopId={shopId}
											item={item}
											onChange={
												(i) => {
													setItems(
														items.map((ei) => ei === item ? {...i} : ei)
													);
													recalculate();
												}
											}
										/>
									)
								}
								</tbody>
								<tfoot>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<th className="money"><Money amount={data.totalPrice}/></th>
								</tr>
								</tfoot>
							</Table>
						</div>
					}
				</Stack>
			</Form>
		</div>
	);
}
