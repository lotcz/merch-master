import {Col, Form, Row, Spinner, Stack, Tab, Table, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {DesignPayload} from "../../types/Design";
import Designer from "../designer/Designer";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'designer';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function DesignDetail() {
	const {id, productId} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<DesignPayload>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	useEffect(
		() => {
			if (!activeTab) return;
			searchParams.set(TAB_PARAM_NAME, activeTab);
			setSearchParams(searchParams, {replace: true});
		},
		[activeTab]
	);

	useEffect(
		() => {
			setActiveTab(StringUtil.getNonEmpty(searchParams.get(TAB_PARAM_NAME), DEFAULT_TAB));
		},
		[id]
	);

	const onChanged = useCallback(
		(design: DesignPayload) => {
			setData(design);
			setChanged(true);
		},
		[]
	);

	const reload = useCallback(
		() => {
			setChanged(false);

			if (id) {
				// load existing
				restClient.designs.loadById(Number(id))
					.then(setData)
					.catch((e: Error) => userAlerts.err(e));
			} else {
				// create new design
				restClient.designer.createNewDesign(Number(productId))
					.then(setData)
					.catch((e: Error) => userAlerts.err(e));
			}
		},
		[id, restClient, userAlerts, productId]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.design.id);
			setSaving(true);
			restClient
				.designs
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/designs/detail/${f.design.id}`, {replace: true});
						} else {
							setData(f);
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false))
		},
		[restClient, data, userAlerts, navigate]
	);

	const deleteDesign = useCallback(
		() => {
			if (!data?.design.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this design?',
				() => {
					setDeleting(true);
					restClient
						.designs
						.delete(Number(data.design.id))
						.then(
							(f) => {
								navigate(-1);
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
					<DeleteButton loading={deleting} disabled={!data.design.id} onClick={deleteDesign}>Delete</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-start">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>UUID:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={StringUtil.getNonEmpty(data.design.uuid)}
									onChange={(e) => {
										data.design.uuid = e.target.value;
										onChanged({...data});
									}}
								/>
							</div>
						</Col>
					</Row>
				</Stack>
			</Form>
			<div>
				<Tabs
					activeKey={activeTab}
					onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
				>
					<Tab title="Designer" eventKey="designer"/>
					<Tab title="Files" eventKey="files">
						<Table>
							<thead>
							<tr>
								<td>ID</td>
								<td>Image</td>
								<td>Zone</td>
							</tr>
							</thead>
							<tbody>
							{
								data.files.map(
									(designFile, index) => <tr key={index}>
										<td>{designFile.id}</td>
										<td>{designFile.imageName}</td>
										<td>{designFile.printZoneId}</td>
									</tr>
								)
							}
							</tbody>
						</Table>
					</Tab>
				</Tabs>
				<div>
					{
						activeTab === 'designer' && <Designer
							client={restClient.designer}
							design={data}
							onChange={onChanged}
							onError={(e) => userAlerts.err(e)}
						/>
					}
				</div>
			</div>
		</div>
	)
}
