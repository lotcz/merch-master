import {Form, Spinner, Stack} from "react-bootstrap";
import {useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../../shared/component/general/BackIconLink";
import {CreatorStub} from "../../../../shared/types/Creator";
import UserStateSelect from "../user/UserStateSelect";
import UserSelect from "../user/UserSelect";
import AccountSelect from "../account/AccountSelect";
import {useNavigator} from "../../../../shared/navigator/OmAppNavigator";

export default function CreatorDetail() {
	const {id, accountId, userId} = useParams();
	const navigator = useNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<CreatorStub>();
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
				accountId: Number(accountId),
				userId: Number(userId),
				userState: "Active"
			});
			setChanged(true);
			return;
		}
		setData(undefined);
		restClient.creators
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, accountId, userId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.creators
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigator.admin.accounts.creators.detail(f.id, true);
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
		confirmDialog.confirm("Confirm", "Really delete this user? Consider making it inactive.", () => {
			setDeleting(true);
			restClient.users
				.delete(Number(data.id))
				.then((f) => {
					navigator.admin.accounts.creators.list();
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
					<FormRow label="User">
						<UserSelect
							userId={data.userId}
							onChange={(e) => {
								data.userId = e;
								onChanged();
							}}
						/>
					</FormRow>
					<FormRow label="Account">
						<AccountSelect
							accountId={data.accountId}
							onChange={(e) => {
								data.accountId = e;
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
		</div>
	);
}
