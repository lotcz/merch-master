import {Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {AdminRestClientContext} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import {ShopStub} from "../../../shared/types/Shop";
import AccountPreview from "../account/AccountPreview";
import ShopStateSelect from "./ShopStateSelect";
import SyncStateSelect from "../general/SyncStateSelect";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "shop-products";

export default function ShopDetail() {
	const {id, accountId} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(AdminRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<ShopStub>();
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
				accountId: Number(accountId),
				name: "",
				slug: "",
				state: "Approved",
				syncState: "Pending"
			});
			return;
		}
		setData(undefined);
		restClient.shops
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, accountId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.shops
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigate(`/admin/shops/detail/${f.id}`, {replace: true});
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, userAlerts, navigate]);

	const deleteAccount = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this shop? Consider making it inactive.", () => {
			setDeleting(true);
			restClient.shops
				.delete(Number(data.id))
				.then((f) => {
					navigate(-1);
				})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setDeleting(false));
		});
	}, [restClient, data, userAlerts, navigate, confirmDialog]);

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
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteAccount}>
						Delete
					</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<FormRow label="Account">
						<AccountPreview accountId={data.accountId}/>
					</FormRow>
					<FormRowControl
						label="Name"
						type="text"
						value={data.name}
						onChange={(e) => {
							data.name = e.target.value;
							onChanged();
						}}
					/>
					<FormRow label="State">
						<ShopStateSelect
							state={data.state}
							onChange={(e) => {
								data.state = e;
								onChanged();
							}}
						/>
					</FormRow>
					<FormRowControl
						label="Slug"
						type="text"
						value={data.slug}
						onChange={(e) => {
							data.slug = e.target.value;
							onChanged();
						}}
					/>

					<FormRow forId="sync_state" label="Sync">
						<SyncStateSelect
							state={data.syncState}
							onChange={(e) => {
								data.syncState = e;
								onChanged();
							}}
						/>
					</FormRow>
				</Stack>
			</Form>
			{data.id && (
				<div className="mt-2">
					<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
						<Tab title="Products" eventKey="products"/>
						<Tab title="Orders" eventKey="orders"/>
					</Tabs>
					<div className="px-3 py-1">
						{activeTab === "products" && <></>}
						{activeTab === "orders" && <></>}
					</div>
				</div>
			)}
		</div>
	);
}
