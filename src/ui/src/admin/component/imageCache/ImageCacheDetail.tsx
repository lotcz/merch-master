import {Form, Spinner, Stack} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {AdminRestClientContext} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, FormRow, FormRowControl, SaveButton} from "zavadil-react-common";
import BackIconLink from "../../../shared/component/general/BackIconLink";
import AccountPreview from "../account/AccountPreview";
import {ImageCacheStub} from "../../../shared/types/Image";
import {ImagezUploadInput} from "../../../shared/component/images/ImagezUploadInput";

export default function ImageCacheDetail() {
	const {id, accountId} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(AdminRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<ImageCacheStub>();
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
				imageName: "",
				originalImageName: "",
				originalImageWidthPx: 0,
				originalImageHeightPx: 0
			});
			return;
		}
		setData(undefined);
		restClient.imageCache
			.loadSingleStub(Number(id))
			.then(setData)
			.catch((e: Error) => userAlerts.err(e));
	}, [id, accountId, restClient, userAlerts]);

	useEffect(reload, [id]);

	const saveData = useCallback(() => {
		if (!data) return;
		const inserting = NumberUtil.isEmpty(data.id);
		setSaving(true);
		restClient.imageCache
			.saveStub(data)
			.then((f) => {
				if (inserting) {
					navigate(`/admin/accounts/image-cache/detail/${f.id}`, {replace: true});
				} else {
					setData(f);
				}
				setChanged(false);
			})
			.catch((e: Error) => userAlerts.err(e))
			.finally(() => setSaving(false));
	}, [restClient, data, userAlerts, navigate]);

	const deleteImage = useCallback(() => {
		if (!data?.id) return;
		confirmDialog.confirm("Confirm", "Really delete this image?", () => {
			setDeleting(true);
			restClient.imageCache
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
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteImage}>
						Delete
					</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<FormRow label="Account">
						<AccountPreview accountId={data.accountId}/>
					</FormRow>
					<FormRow label="Image">
						<ImagezUploadInput
							name={data.imageName}
							onSelected={
								(name, health) => {
									data.imageName = health.name;
									data.originalImageWidthPx = health.width;
									data.originalImageHeightPx = health.height;
									data.originalImageName = name;
									onChanged();
								}
							}
						/>
					</FormRow>
					<FormRowControl
						label="Original Name"
						type="text"
						value={data.originalImageName}
						onChange={(e) => {
							data.originalImageName = e.target.value;
							onChanged();
						}}
					/>
					<FormRowControl
						label="Width"
						type="text"
						value={data.originalImageWidthPx}
						onChange={(e) => {
							data.originalImageWidthPx = Number(e.target.value);
							onChanged();
						}}
					/>
					<FormRowControl
						label="Height"
						type="text"
						value={data.originalImageHeightPx}
						onChange={(e) => {
							data.originalImageHeightPx = Number(e.target.value);
							onChanged();
						}}
					/>
				</Stack>
			</Form>
		</div>
	);
}
