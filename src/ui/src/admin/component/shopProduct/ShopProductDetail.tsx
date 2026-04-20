import {Form, Spinner, Stack} from "react-bootstrap";
import {useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, Localize, SaveButton, Switch} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import {useAdminNavigator} from "../../navigator/AdminNavigator";
import {ShopProductStub} from "../../../shared/types/ShopProduct";
import ShopLink from "../shop/ShopLink";
import ShopCategorySelect from "../shopCategory/ShopCategorySelect";
import DesignSelectByShop from "../designs/DesignSelectByShop";

export default function ShopProductDetail() {
	const {id, shopId} = useParams();
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<ShopProductStub>();
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
				shopId: Number(shopId),
				categoryId: 0,
				designId: 0,
				name: "",
				visible: true,
				creatorProfit: 0
			});
			return;
		}
		setData(undefined);
		restClient.shopProducts
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, shopId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.shopProducts
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigator.shops.products.detail(f.id, true);
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
		confirmDialog.confirm("Confirm", "Really delete this product?", () => {
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
					<FormRow label="Shop">
						<ShopLink shopId={data.shopId}/>
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
					<FormRow label="Category">
						<ShopCategorySelect
							shopId={data.shopId}
							categoryId={data.categoryId}
							onChange={(e) => {
								data.categoryId = e;
								onChanged();
							}}
						/>
					</FormRow>
					<FormRow label="Design">
						<DesignSelectByShop
							shopId={data.shopId}
							designId={data.designId}
							onChange={(e) => {
								data.designId = Number(e);
								onChanged();
							}}
						/>
					</FormRow>
					<Switch
						label={<Localize text="Visible"/>}
						checked={data.visible}
						onChange={(e) => {
							data.visible = e;
							onChanged();
						}}
					/>
					<FormRowControl
						label="Profit"
						type="integer"
						value={data.creatorProfit}
						onChange={(e) => {
							data.creatorProfit = Number(e.target.value);
							onChanged();
						}}
					/>
				</Stack>
			</Form>
		</div>
	);
}
