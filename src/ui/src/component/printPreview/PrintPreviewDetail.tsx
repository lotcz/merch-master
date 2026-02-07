import {Col, Form, Row, Spinner, Stack, Tab, Table, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import conf from "../../config/conf.json";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/merchMaster/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {PrintPreviewPayload} from "../../types/PrintPreview";
import {ImagezUploadInput} from "../images/ImagezUploadInput";
import PrintPreviewDesigner from "./PrintPreviewDesigner";
import DesignerPreview from "../designer/preview/DesignerPreview";
import {PrintZoneStub} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import ProductPreview from "../products/ProductPreview";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'design';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function PrintPreviewDetail() {
	const {id, productId} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<PrintPreviewPayload>();
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
		(newData?: PrintPreviewPayload) => {
			if (!data) return;
			setData(newData ? newData : {...data});
			setChanged(true);
		},
		[data]
	);

	const [productZones, setProductZones] = useState<Array<PrintZoneStub>>();

	const effectiveProductId = useMemo(
		() => data?.printPreview.productId,
		[data]
	);

	const loadZones = useCallback(
		() => {
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
				restClient.printPreviews.loadById(Number(id))
					.then(setData)
					.catch((e: Error) => userAlerts.err(e));
			} else {
				setData(
					{
						printPreview: {
							name: '',
							productId: Number(productId),
							imageWidthPx: 0,
							imageHeightPx: 0
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
			const inserting = NumberUtil.isEmpty(data.printPreview.id);
			setSaving(true);
			restClient
				.printPreviews
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/products/print-previews/detail/${f.printPreview.id}`, {replace: true});
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

	const deletePrintPreview = useCallback(
		() => {
			if (!data?.printPreview.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this print preview?',
				() => {
					setDeleting(true);
					restClient
						.printPreviews
						.delete(Number(data.printPreview.id))
						.then(
							(f) => {
								navigate(`/products/detail/${data.printPreview.productId}`);
							})
						.catch((e: Error) => userAlerts.err(e))
						.finally(() => setDeleting(false))
				}
			);
		},
		[restClient, data, userAlerts, navigate, confirmDialog]
	);

	const dummyDesign: DesignPayload | undefined = useMemo(
		() => {
			if (!data) return;
			if (!productZones) return;
			return {
				design: {
					id: 0,
					printTypeId: 0,
					productColorId: 0,
					confirmed: false
				},
				files: data.zones.map(
					(z, index) => {
						const productZone = productZones.find((pz) => pz.id === z.printZoneId);
						return {
							id: index,
							printZoneId: Number(z.printZoneId),
							designId: 0,
							imageName: conf.PREVIEW_ZONE_IMAGE,
							originalImageName: 'dummy',
							originalImageWidthPx: 0,
							originalImageHeightPx: 0,
							positionXMm: 0,
							positionYMm: 0,
							imageWidthMm: Number(productZone?.widthMm),
							imageHeightMm: Number(productZone?.heightMm),
							aspectLocked: false
						}
					}
				)
			};
		},
		[data, productZones]
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
					<DeleteButton loading={deleting} disabled={!data.printPreview.id} onClick={deletePrintPreview}>Delete</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Row className="align-items-start">
							<Col md={COL_1_MD} lg={COL_1_LG}>
								<Form.Label>Product:</Form.Label>
							</Col>
							<Col md={COL_2_MD} lg={COL_2_LG}>
								<div>
									<ProductPreview productId={data.printPreview.productId}/>
								</div>
							</Col>
						</Row>
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={data.printPreview.name}
									onChange={
										(e) => {
											data.printPreview.name = e.target.value;
											onChanged();
										}
									}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Image:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<ImagezUploadInput
									name={data.printPreview.imageName}
									onSelected={
										(name, health) => {
											data.printPreview.imageName = name;
											data.printPreview.imageHeightPx = health.height;
											data.printPreview.imageWidthPx = health.width;
											onChanged();
										}
									}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Foreground:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<ImagezUploadInput
									name={data.printPreview.foregroundName}
									onSelected={
										(name, health) => {
											data.printPreview.foregroundName = name;
											onChanged();
										}
									}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Image Width:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={data.printPreview.imageWidthPx}
									onChange={
										(e) => {
											data.printPreview.imageWidthPx = Number(e.target.value);
											onChanged();
										}
									}
								/>
							</div>
						</Col>
					</Row>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Image Height:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={data.printPreview.imageHeightPx}
									onChange={
										(e) => {
											data.printPreview.imageHeightPx = Number(e.target.value);
											onChanged();
										}
									}
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
						<Tab title="Design" eventKey="design">
							{
								productZones && <Stack direction="horizontal" gap={2}>
									<PrintPreviewDesigner
										printPreview={data}
										productZones={productZones}
										onChange={onChanged}
									/>
									{
										dummyDesign && <DesignerPreview
											design={dummyDesign}
											preview={data}
											productZones={productZones}
											maxWidth={600}
											maxHeight={400}
											onError={(e) => userAlerts.err(e)}
										/>
									}
								</Stack>
							}
						</Tab>
						<Tab title="Zones" eventKey="zones">
							<Table>
								<thead>
								<tr>
									<td>Preview Zone ID</td>
									<td>Zone ID</td>
									<td>Name</td>
									<td>StartX</td>
									<td>StartY</td>
									<td>Width</td>
									<td>Height</td>
								</tr>
								</thead>
								<tbody>
								{
									data.zones.map(
										(previewZone, index) => <tr key={index}>
											<td>{previewZone.id}</td>
											<td>{previewZone.printZoneId}</td>
											<td>{productZones?.find((z) => z.id === previewZone.printZoneId)?.name}</td>
											<td>{previewZone.startXPx}</td>
											<td>{previewZone.startYPx}</td>
											<td>{previewZone.widthPx}</td>
											<td>{previewZone.heightPx}</td>
										</tr>
									)
								}
								</tbody>
							</Table>

						</Tab>
					</Tabs>
				</div>
			}
		</div>
	)
}
