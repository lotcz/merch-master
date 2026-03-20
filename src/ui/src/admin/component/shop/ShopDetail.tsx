import {Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useParams, useSearchParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import {ShopStub} from "../../../shared/types/Shop";
import AccountPreview from "../account/AccountPreview";
import ShopStateSelect from "./ShopStateSelect";
import SyncStateSelect from "../general/SyncStateSelect";
import {useAdminNavigator} from "../../navigator/AdminNavigator";
import ShopProductsList from "./ShopProductsList";
import ShopCategoriesList from "./ShopCategoriesList";
import {ImagezUploadInput} from "../../../shared/component/images/ImagezUploadInput";
import ShopPreview from "./ShopPreview";

const TAB_PARAM_NAME = "tab";
const DEFAULT_TAB = "categories";

export default function ShopDetail() {
	const {id, accountId} = useParams();
	const navigator = useAdminNavigator();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useAdminRestClient();
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
				oauthAudienceName: "",
				name: "",
				slug: "",
				backgroundColor: "#ffffff",
				foregroundColor: "#000000",
				linkColor: "#0000ff",
				fontFamily: "Times New Roman, serif",
				brandBgColor: "#ff0000",
				brandFgColor: "#ffffff",
				brandShowName: true,
				brandFontFamily: "Arial, sans-serif",
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
					navigator.shops.detail(f.id, true);
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
		confirmDialog.confirm("Confirm", "Really delete this shop? Consider making it inactive.", () => {
			setDeleting(true);
			restClient.shops
				.delete(Number(data.id))
				.then((f) => {
					navigator.shops.list();
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
					<Stack direction="horizontal" className="align-items-start" gap={4}>
						<FormRowControl
							label="Name"
							type="text"
							value={data.name}
							onChange={(e) => {
								data.name = e.target.value;
								onChanged();
							}}
						/>
						<FormRowControl
							label="Slug"
							type="text"
							value={data.slug}
							onChange={(e) => {
								data.slug = e.target.value;
								onChanged();
							}}
						/>
					</Stack>

					<Stack direction="horizontal" className="align-items-start" gap={4}>
						<FormRow label="Account">
							<AccountPreview accountId={data.accountId}/>
						</FormRow>
						<FormRow label="State">
							<ShopStateSelect
								state={data.state}
								onChange={(e) => {
									data.state = e;
									onChanged();
								}}
							/>
						</FormRow>
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

					<Row>
						<Col>
							<Stack direction="horizontal" className="align-items-start" gap={4}>
								<FormRowControl
									label="Brand background"
									type="color"
									value={data.brandBgColor}
									onChange={(e) => {
										data.brandBgColor = e.target.value;
										onChanged();
									}}
								/>
								<FormRowControl
									label="Brand text"
									type="color"
									value={data.brandFgColor}
									onChange={(e) => {
										data.brandFgColor = e.target.value;
										onChanged();
									}}
								/>
							</Stack>
							<FormRow label="Brand image">
								<ImagezUploadInput
									name={data.brandImage}
									onSelected={(e) => {
										data.brandImage = e;
										onChanged();
									}}
								/>
							</FormRow>
							<FormRowControl
								label="Brand font"
								type="text"
								maxLength={255}
								value={data.brandFontFamily}
								onChange={(e) => {
									data.brandFontFamily = e.target.value;
									onChanged();
								}}
							/>
							<Stack direction="horizontal" className="align-items-start" gap={4}>
								<FormRowControl
									label="Background color"
									type="color"
									value={data.backgroundColor}
									onChange={(e) => {
										data.backgroundColor = e.target.value;
										onChanged();
									}}
								/>
								<FormRowControl
									label="Text color"
									type="color"
									value={data.foregroundColor}
									onChange={(e) => {
										data.foregroundColor = e.target.value;
										onChanged();
									}}
								/>
								<FormRowControl
									label="Link color"
									type="color"
									value={data.linkColor}
									onChange={(e) => {
										data.linkColor = e.target.value;
										onChanged();
									}}
								/>
							</Stack>
							<FormRowControl
								label="Text font"
								type="text"
								maxLength={255}
								value={data.fontFamily}
								onChange={(e) => {
									data.fontFamily = e.target.value;
									onChanged();
								}}
							/>
						</Col>
						<Col>
							<ShopPreview shop={data}/>
						</Col>
					</Row>


				</Stack>
			</Form>
			{data.id && (
				<div className="mt-2">
					<Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}>
						<Tab title="Categories" eventKey="categories"/>
						<Tab title="Products" eventKey="products"/>
						<Tab title="Orders" eventKey="orders"/>
					</Tabs>
					<div className="px-3 py-1">
						{activeTab === "categories" && <ShopCategoriesList shopId={data.id}/>}
						{activeTab === "products" && <ShopProductsList shopId={data.id}/>}
						{activeTab === "orders" && <></>}
					</div>
				</div>
			)}
		</div>
	);
}
