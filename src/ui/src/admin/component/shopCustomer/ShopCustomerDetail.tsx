import {Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import {useAdminNavigator} from "../../navigator/AdminNavigator";
import {ShopCustomerStub} from "../../../shared/types/ShopCustomer";
import ShopSelect from "../shop/ShopSelect";
import UserSelect from "../user/UserSelect";
import UserStateSelect from "../user/UserStateSelect";
import ShopCustomerOrdersList from "./ShopCustomerOrdersList";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "orders";

export default function ShopCustomerDetail() {
	const {id, shopId} = useParams();
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<ShopCustomerStub>();
	const [activeTab, setActiveTab] = useState<string>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	useEffect(() => {
		if (!activeTab) return;
		searchParams.set(TAB_PARAM_NAME, activeTab);
		setSearchParams(searchParams, {replace: true});
	}, [activeTab]);

	useEffect(() => {
		setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
	}, [id]);

	const onChanged = useCallback(() => {
		if (!data) return;
		setData({...data});
		setChanged(true);
	}, [data]);

	const reload = useCallback(() => {
		if (!id) {
			setData({
				userState: "Active",
				shopId: Number(shopId),
				userId: 0
			});
			return;
		}
		setData(undefined);
		restClient.shopCustomers
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, shopId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.shopCustomers
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigator.shops.customers.detail(f.id, true);
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, userAlerts, navigator]);

	const deleteCustomer = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this customer?", () => {
			setDeleting(true);
			restClient.shopCustomers
				.delete(Number(data.id))
				.then((f) => {
					navigator.shops.customers.list();
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
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteCustomer}>
						Delete
					</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<FormRow label="Shop">
						<ShopSelect
							shopId={data.shopId}
							onChange={(e) => {
								data.shopId = Number(e);
								onChanged();
							}}
						/>
					</FormRow>
					<FormRow label="User">
						<UserSelect
							userId={data.userId}
							onChange={(e) => {
								data.userId = Number(e);
								onChanged();
							}}
						/>
					</FormRow>
					<FormRow label="State">
						<UserStateSelect
							state={data.userState}
							onChange={(e) => {
								data.userState = e;
								onChanged();
							}}
						/>
					</FormRow>
				</Stack>
			</Form>
			{
				data.id && (
					<div className="mt-2">
						<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
							<Tab title="Orders" eventKey="orders"/>
						</Tabs>
						<div className="px-3 py-1">
							{activeTab === "orders" && <ShopCustomerOrdersList customerId={data.id}/>}
						</div>
					</div>
				)
			}
		</div>
	);
}
