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
const DEFAULT_TAB = 'files';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function DesignDetail() {
	const {id} = useParams();
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
		() => {
			if (!data) return;
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const reload = useCallback(
		() => {
			if (!id) {
				setData({
					design: {
						confirmed: false
					},
					files: []
				});
				return;
			}
			setData(undefined);
			restClient.designs.loadById(Number(id))
				.then(setData)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
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
										onChanged();
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
					<Tab title="Files" eventKey="files">
						<Table>
							<thead>
							<tr>
								<td>ID</td>
								<td>Image</td>
							</tr>
							</thead>
							<tbody>
							{
								data.files.map(
									(designFile, index) => <tr key={index}>
										<td>{designFile.id}</td>
										<td>{designFile.imageName}</td>
									</tr>
								)
							}
							</tbody>
						</Table>
					</Tab>
					<Tab title="Designer" eventKey="designer"/>
				</Tabs>
				<div>
					{
						activeTab === 'designer' && <Designer
							uuid={data.design.uuid}
							onFinished={
								(uuid) => {
									restClient.designs
										.loadByUuid(uuid)
										.then(
											(d) => {
												if (data.design.id) {
													reload();
												} else {
													navigate(`/designs/detail/${d.design.id}`, {replace: true});
												}
											}
										);
								}
							}
						/>
					}
				</div>
			</div>
		</div>
	)
}
