import {Col, Form, Row, Spinner, Stack, Tab, Tabs} from "react-bootstrap";
import {useNavigate, useParams, useSearchParams} from "react-router";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {MerchMasterRestClientContext} from "../../client/merchMaster/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {ConfirmDialogContext, DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {Product} from "../../types/Product";
import ProductPrintTypesList from "./ProductPrintTypesList";
import ProductColorsList from "./ProductColorsList";
import ProductPrintZonesList from "./ProductPrintZonesList";
import ProductPrintPreviewsList from "./ProductPrintPreviewsList";

const TAB_PARAM_NAME = 'tab';
const DEFAULT_TAB = 'print-types';

const COL_1_MD = 3;
const COL_2_MD = 5;
const COL_1_LG = 2;
const COL_2_LG = 6;

export default function ProductDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const confirmDialog = useContext(ConfirmDialogContext);
	const [activeTab, setActiveTab] = useState<string>();
	const [data, setData] = useState<Product>();
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
					name: ''
				});
				return;
			}
			setData(undefined);
			restClient.products.loadSingle(Number(id))
				.then(setData)
				.catch((e: Error) => userAlerts.err(e))
		},
		[id, restClient, userAlerts]
	);

	useEffect(reload, [id]);

	const saveData = useCallback(
		() => {
			if (!data) return;
			const inserting = NumberUtil.isEmpty(data.id);
			setSaving(true);
			restClient
				.products
				.save(data)
				.then(
					(f) => {
						if (inserting) {
							navigate(`/products/detail/${f.id}`, {replace: true});
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

	const deleteProduct = useCallback(
		() => {
			if (!data?.id) return;
			confirmDialog.confirm(
				'Confirm',
				'Really delete this product?',
				() => {
					setDeleting(true);
					restClient
						.products
						.delete(Number(data.id))
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
					<DeleteButton loading={deleting} disabled={!data.id} onClick={deleteProduct}>Delete</DeleteButton>
				</Stack>
			</div>

			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-start">
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
				</Stack>
			</Form>
			{
				data.id && <div className="mt-2">
					<Tabs
						activeKey={activeTab}
						onSelect={(key) => setActiveTab(StringUtil.getNonEmpty(key, DEFAULT_TAB))}
					>
						<Tab title="Print Types" eventKey="print-types"/>
						<Tab title="Print Zones" eventKey="print-zones"/>
						<Tab title="Colors" eventKey="product-colors"/>
						<Tab title="Previews" eventKey="previews"/>
					</Tabs>
					<div className="px-3 py-1">
						{
							activeTab === 'print-types' && <ProductPrintTypesList productId={data.id}/>
						}
						{
							activeTab === 'print-zones' && <ProductPrintZonesList productId={data.id}/>
						}
						{
							activeTab === 'product-colors' && <ProductColorsList productId={data.id}/>
						}
						{
							activeTab === 'previews' && <ProductPrintPreviewsList productId={data.id}/>
						}
					</div>
				</div>
			}
		</div>
	)
}
