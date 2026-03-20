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
import ShopLink from "../shop/ShopLink";
import {ShopCategoryStub} from "../../../shared/types/ShopCategory";

export default function ShopCategoryDetail() {
	const {id, shopId} = useParams();
	const navigator = useAdminNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<ShopCategoryStub>();
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
				name: "",
				visible: true
			});
			return;
		}
		setData(undefined);
		restClient.shopCategories
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, shopId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.shopCategories
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigator.shops.categories.detail(f.id, true);
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, userAlerts, navigator]);

	const deleteCategory = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this category?", () => {
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
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteCategory}>
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
					<Switch
						label={<Localize text="Visible"/>}
						checked={data.visible}
						onChange={(e) => {
							data.visible = e;
							onChanged();
						}}
					/>
				</Stack>
			</Form>
		</div>
	);
}
