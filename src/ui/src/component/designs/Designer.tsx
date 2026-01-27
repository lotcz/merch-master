import {Col, Form, Row, Spinner, Stack, Tab, Table, Tabs} from "react-bootstrap";
import {useParams} from "react-router";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import RefreshIconButton from "../general/RefreshIconButton";
import {DeleteButton, SaveButton} from "zavadil-react-common";
import BackIconLink from "../general/BackIconLink";
import {DesignPayload} from "../../types/Design";
import {PrintTypeStub} from "../../types/PrintType";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import { Product } from "../../types/Product";

export default function Designer() {
	const {uuid} = useParams();

	const [error, setError] = useState<string>();

	const [design, setDesign] = useState<DesignPayload>();
	const [products, setProducts] = useState<Array<Product>>();
	const [selectedProduct, setSelectedProduct] = useState<Product>();
	const [printTypes, setPrintTypes] = useState<Array<PrintTypeStub>>();
	const [selectedPrintType, setSelectedPrintType] = useState<PrintTypeStub>();

	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);

	const client = useMemo(() => new DesignerRestClient(), []);

	const loadProducts = useCallback(
		() => {
			client
				.loadProducts()
				.then(setProducts)
				.catch((e: Error) => setError(e.message))
		},
		[client]
	);

	useEffect(loadProducts, []);

	const loadPrintTypes = useCallback(
		() => {
			client
				.loadProducts()
				.then(setProducts)
				.catch((e: Error) => setError(e.message))
		},
		[client]
	);

	useEffect(loadProducts, []);

	const onChanged = useCallback(
		() => {
			if (!design) return;
			setDesign({...design});
			setChanged(true);
		},
		[design]
	);

	const reload = useCallback(
		() => {
			if (!uuid) {
				setDesign({
					design: {},
					files: []
				});
				return;
			}
			client.lNumber(id))
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
				</Tabs>
			</div>
		</div>
	)
}
