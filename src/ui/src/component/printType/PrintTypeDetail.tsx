import {Button, Col, Form, Row, Spinner, Stack, Tab, Table, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {PrintTypePayload} from "../../types/PrintType";
import ProductPreview from "../products/ProductPreview";
import {PrintZonePayload} from "../../types/PrintZone";
import PrintZoneForm from "./PrintZoneForm";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'print-zones';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function PrintTypeDetail() {
	const {id, productId} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<PrintTypePayload>();
	const [selectedPrintZone, setSelectedPrintZone] = useState<PrintZonePayload>();
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
			data.zones = [...data.zones];
			setData({...data});
			setChanged(true);
		},
		[data]
	);

	const addPrintZone = useCallback(
		() => {
			if (!data) return;
			const zone: PrintZonePayload = {
				printZone: {
					name: 'Přední strana',
					printTypeId: data.printType.id,
					width: 100,
					height: 100
				},
				previews: []
			};
			data.zones.push(zone);
			setSelectedPrintZone(zone);
			onChanged();
		},
		[data, onChanged]
	);

	const removePrintZone = useCallback(
		() => {
			if (!selectedPrintZone) return;
			if (!data) return;
			data.zones.splice(data.zones.indexOf(selectedPrintZone), 1);
			setSelectedPrintZone(data.zones.length > 0 ? data.zones[0] : undefined);
			onChanged();
		},
		[data, selectedPrintZone, onChanged]
	);

	const reload = useCallback(
		() => {
			if (!id) {
				setData({
					printType: {
						name: '',
						productId: NumberUtil.parseNumber(productId) || 0
					},
					zones: []
				});
				return;
			}
			setData(undefined);
			restClient.printTypes.loadById(Number(id))
				.then(
					(pt) => {
						setData(pt);
						if (pt.zones.length > 0) {
							setSelectedPrintZone(pt.zones[0]);
						}
					}
				)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, productId, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.printType.id);
			setSaving(true);
			restClient
				.printTypes
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/products/print-types/detail/${f.printType.id}`, {replace: true});
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

	const deletePrintType = useCallback(
		() => {
			if (!data?.printType.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this print type?',
				() => {
					setDeleting(true);
					restClient
						.products
						.delete(Number(data.printType.id))
						.then(
							(f) => {
								navigate(`/products/${data.printType.productId}`);
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
					<DeleteButton loading={deleting} disabled={!data.printType.id} onClick={deletePrintType}>Delete</DeleteButton>
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
								<ProductPreview productId={data.printType.productId}/>
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
									value={data.printType.name}
									onChange={(e) => {
										data.printType.name = e.target.value;
										onChanged();
									}}
								/>
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
						<Tab title="Print Zones" eventKey="print-zones">
							<div className="p-2">
								<div className="d-flex gap-2 align-items-center">
									<Button onClick={addPrintZone}>+ Add</Button>
									<Button onClick={removePrintZone} disabled={selectedPrintZone === undefined} variant="warning">- Remove</Button>
								</div>
								<Row className="mt-2">
									<Col md={3} lg={2}>
										<Table>
											<tbody>
											{
												data.zones.map(
													(printZone) => <tr
														className={`cursor-pointer ${printZone === selectedPrintZone ? 'table-active' : ''}`}
														onClick={() => setSelectedPrintZone(printZone)}
													>
														<td>
															{printZone.printZone.name}
														</td>
													</tr>
												)
											}
											</tbody>
										</Table>
									</Col>
									<Col>
										<div>
											{
												selectedPrintZone && <PrintZoneForm
													printZone={selectedPrintZone}
													onChange={
														(pz) => {
															const i = data.zones.indexOf(selectedPrintZone);
															data.zones[i] = pz;
															setSelectedPrintZone(pz);
															onChanged();
														}
													}
												/>
											}
										</div>
									</Col>
								</Row>
							</div>
						</Tab>
					</Tabs>
				</div>
			}
		</div>
	)
}
