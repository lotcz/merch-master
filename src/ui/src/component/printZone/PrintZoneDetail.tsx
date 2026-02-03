import {Col, Form, Row, Spinner, Stack} from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/merchMaster/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {PrintZoneStub} from "../../types/PrintZone";
import ProductPreview from "../products/ProductPreview";

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function PrintZoneDetail() {
	const {id, productId} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [data, setData] = useState<PrintZoneStub>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const onChanged = useCallback(
		() => {
			if (!data) return;
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const reload = useCallback(
		() => {
			if (id) {
				restClient.printZones.loadById(Number(id))
					.then(setData)
					.catch((e: Error) => userAlerts.err(e));
			} else {
				setData(
					{
						name: '',
						productId: Number(productId),
						widthMm: 80,
						heightMm: 80
					}
				);
			}
			setChanged(false);
		},
		[id, productId, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.id);
			setSaving(true);
			restClient
				.printZones
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/products/print-zones/detail/${f.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false));
		},
		[restClient, data, userAlerts, navigate]
	);

	const deletePrintZone = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this print zone?',
				() => {
					setDeleting(true);
					restClient
						.printZones
						.delete(Number(data.id))
						.then(
							(f) => {
								navigate(`/products/${data.productId}`);
							})
						.catch((e: Error) => userAlerts.err(e))
						.finally(() => setDeleting(false))
				}
			);
		},
		[restClient, data, userAlerts, navigate, confirmDialog]
	);

	if (!data) {
		return <Spinner/>
	}

	return (
		<div>
			<div className="p-2">
				<Stack direction="horizontal" gap={2}>
					<BackIconLink changed={changed}/>
					<RefreshIconButton onClick={reload}/>
					<SaveButton loading={saving} disabled={!changed} onClick={saveData}>Save</SaveButton>
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deletePrintZone}>Delete</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Product:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<ProductPreview productId={data.productId}/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={data.name}
									onChange={(e) => {
										data.name = e.target.value;
										onChanged();
									}}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Width:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div className="d-flex align-items-center">
								<Form.Control
									type="text"
									value={data.widthMm}
									onChange={(e) => {
										data.widthMm = Number(e.target.value);
										onChanged();
									}}
								/>
								<span>mm</span>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Height:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div className="d-flex align-items-center">
								<Form.Control
									type="text"
									value={data.heightMm}
									onChange={(e) => {
										data.heightMm = Number(e.target.value);
										onChanged();
									}}
								/>
								<span>mm</span>
							</div>
						</Col>
					</Row>
				</Stack>
			</Form>
		</div>
	)
}
