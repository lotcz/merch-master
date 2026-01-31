import {Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton, Switch} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {PrintTypeAdminPayload} from "../../types/PrintType";
import ProductPreview from "../products/ProductPreview";
import {PrintZoneStub} from "../../types/PrintZone";

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
	const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB);
	const [data, setData] = useState<PrintTypeAdminPayload>();
	const [productZones, setProductZones] = useState<Array<PrintZoneStub>>();
	const [changed, setChanged] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const effectiveProductId = useMemo(
		() => data?.printType.productId,
		[data]
	);

	useEffect(
		() => {
			if (!activeTab) return;
			searchParams.set(TAB_PARAM_NAME, activeTab);
			setSearchParams(searchParams, {replace: true});
		},
		[activeTab]
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

	const loadZones = useCallback(
		() => {
			setProductZones(undefined);
			if (!effectiveProductId) return;
			restClient.printZones
				.loadByProduct(effectiveProductId)
				.then(setProductZones);
		},
		[restClient, effectiveProductId]
	);

	useEffect(loadZones, [effectiveProductId]);

	const reload = useCallback(
		() => {
			if (id) {
				restClient.printTypes.loadById(Number(id))
					.then(
						(pt) => {
							setData(pt);
							setChanged(false);

						}
					).catch((e: Error) => userAlerts.err(e));
			} else {
				setData(
					{
						printType: {
							name: '',
							productId: NumberUtil.parseNumber(productId) || 0
						},
						zones: []
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
								<Form>
									{
										productZones && productZones.map(
											(productZone) => <div>
												{
													productZone.id && <Switch
														id={`zone-${productZone.id}`}
														checked={data.zones.includes(productZone.id)}
														onChange={
															(checked) => {
																if (!productZone.id) return;
																const exists = data.zones.includes(productZone.id);
																if (exists && !checked) {
																	data.zones = data.zones.filter(z => z !== productZone.id);
																}
																if (checked && !exists) {
																	data.zones.push(productZone.id);
																}
																onChanged();
															}
														}
														label={productZone.name}
													/>
												}
											</div>
										)
									}
								</Form>
							</div>
						</Tab>
					</Tabs>
				</div>
			}
		</div>
	)
}
