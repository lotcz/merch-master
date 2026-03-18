import {Form, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import {Account} from "../../../shared/types/Account";
import AccountShopsList from "./AccountShopsList";
import AccountCreatorsList from "./AccountCreatorsList";
import AccountStateSelect from "./AccountStateSelect";
import AccountImageCacheList from "./AccountImageCacheList";
import {useAdminNavigator} from "../../navigator/AdminNavigator";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "shops";

export default function AccountDetail() {
	const {id} = useParams();
	const navigator = useAdminNavigator();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Account>();
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
				name: "",
				uuid: "",
				state: "Approved"
			});
			return;
		}
		setData(undefined);
		restClient.accounts
			.loadSingle(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.accounts
			.save(data)
			.then((f) => {
				if (inserting) {
					navigator.accounts.detail(f.id, true);
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, userAlerts, navigator]);

	const deleteAccount = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this account? Consider making it inactive.", () => {
			setDeleting(true);
			restClient.accounts
				.delete(Number(data.id))
				.then((f) => {
					navigator.accounts.list();
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
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteAccount}>
						Delete
					</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
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
						<AccountStateSelect
							state={data.state}
							onChange={(e) => {
								data.state = e;
								onChanged();
							}}
						/>
					</FormRow>

					<FormRowControl
						label="UUID"
						type="text"
						readOnly={true}
						disabled={true}
						value={data.uuid}
					/>

				</Stack>
			</Form>
			{data.id && (
				<div className="mt-2">
					<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
						<Tab title="Shops" eventKey="shops"/>
						<Tab title="Creators" eventKey="creators"/>
						<Tab title="Image Cache" eventKey="image-cache"/>
					</Tabs>
					<div className="px-3 py-1">
						{activeTab === "shops" && <AccountShopsList accountId={data.id}/>}
						{activeTab === "creators" && <AccountCreatorsList accountId={data.id}/>}
						{activeTab === "image-cache" && <AccountImageCacheList accountId={data.id}/>}
					</div>
				</div>
			)}
		</div>
	);
}
