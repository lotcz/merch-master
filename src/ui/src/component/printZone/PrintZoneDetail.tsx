import {Button, Col, Container, Form, Row, Spinner, Stack, Tab, Table, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {PrintZonePayload} from "../../types/PrintZone";
import PrintPreviewForm from "./PrintPreviewForm";
import {PrintPreviewStub} from "../../types/PrintPreview";
import ProductPreview from "../products/ProductPreview";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'print-previews';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function PrintZoneDetail() {
	const {id, productId} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<PrintZonePayload>();
	const [selectedPrintPreview, setSelectedPrintPreview] = useState<PrintPreviewStub>();
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
			data.previews = [...data.previews];
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const addPrintPreview = useCallback(
		() => {
			if (!data) return;
			const preview: PrintPreviewStub = {
				printZoneId: data.printZone.id,
				name: 'Náhled',
				imageWidth: 0,
				imageHeight: 0,
				zoneStartX: 0,
				zoneStartY: 0,
				zoneWidth: 0,
				zoneHeight: 0

			};
			data.previews.push(preview);
			setSelectedPrintPreview(preview);
			onChanged();
		},
		[data, onChanged]
	);

	const removePrintPreview = useCallback(
		() => {
			if (!data) return;
			if (!selectedPrintPreview) return;
			data.previews.splice(data.previews.indexOf(selectedPrintPreview), 1);
			onChanged();
		},
		[selectedPrintPreview, data, onChanged]
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
						printZone: {
							name: '',
							productId: Number(productId),
							widthMm: 80,
							heightMm: 80
						},
						previews: []
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
			const inserting = NumberUtil.isEmpty(data.printZone.id);
			setSaving(true);
			restClient
				.printZones
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/products/print-zones/detail/${f.printZone.id}`, {replace: true});
						} else {
							setData(f);
							if (selectedPrintPreview) {
								const i = data.previews.indexOf(selectedPrintPreview);
								setSelectedPrintPreview(f.previews[i]);
							}
						}
						setChanged(false);
					})
				.catch((e: Error) => userAlerts.err(e))
				.finally(() => setSaving(false));
		},
		[restClient, data, userAlerts, navigate, selectedPrintPreview]
	);

	const deletePrintType = useCallback(
		() => {
			if (!data?.printZone.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this print zone?',
				() => {
					setDeleting(true);
					restClient
						.products
						.delete(Number(data.printZone.id))
						.then(
							(f) => {
								navigate(`/products/${data.printZone.productId}`);
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
					<DeleteButton loading={deleting} disabled={!data.printZone.id} onClick={deletePrintType}>Delete</DeleteButton>
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
								<ProductPreview productId={data.printZone.productId}/>
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
									value={data.printZone.name}
									onChange={(e) => {
										data.printZone.name = e.target.value;
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
									value={data.printZone.widthMm}
									onChange={(e) => {
										data.printZone.widthMm = Number(e.target.value);
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
									value={data.printZone.heightMm}
									onChange={(e) => {
										data.printZone.heightMm = Number(e.target.value);
										onChanged();
									}}
								/>
								<span>mm</span>
							</div>
						</Col>
					</Row>
				</Stack>
			</Form>
			{
				<div className="mt-2">
					<Tabs
						activeKey={activeTab}
						onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
					>
						<Tab title="Print Previews" eventKey="print-previews">
							<div className="p-2">
								<div className="d-flex gap-2 align-items-center">
									<Button size="sm" onClick={addPrintPreview}>+ Add</Button>
									<Button
										size="sm"
										onClick={removePrintPreview}
										disabled={selectedPrintPreview === undefined}
										variant="warning"
									>
										- Remove
									</Button>
								</div>
								<Container fluid>
									<Row className="d-flex gap-2 align-items-start mt-2">
										<Col md={2} lg={1}>
											<Table>
												<tbody>
												{
													data.previews.map(
														(preview, index) => <tr
															key={index}
															className={`cursor-pointer ${preview === selectedPrintPreview ? 'table-active' : ''}`}
															onClick={() => setSelectedPrintPreview(preview)}
														>
															<td>
																{preview.name}
															</td>
														</tr>
													)
												}
												</tbody>
											</Table>
										</Col>
										<Col>
											{
												selectedPrintPreview && <PrintPreviewForm
													printPreview={selectedPrintPreview}
													onChange={
														(preview) => {
															const i = data.previews.indexOf(selectedPrintPreview);
															data.previews[i] = preview;
															setSelectedPrintPreview(preview);
															onChanged();
														}
													}
												/>
											}
										</Col>
									</Row>
								</Container>
							</div>
						</Tab>
					</Tabs>
				</div>
			}
		</div>
	)
}
