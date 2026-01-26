import {Button, Col, Container, Form, Row, Stack, Tab, Table, Tabs} from "react-bootstrap";
import React, {useCallback, useEffect, useState} from "react";
import {StringUtil} from "zavadil-ts-common";
import {PrintZonePayload} from "../../types/PrintZone";
import {PrintPreviewStub} from "../../types/PrintPreview";
import PrintPreviewForm from "./PrintPreviewForm";

const DEFAULT_TAB = 'print-previews';

const COL_1_MD = 3;
const COL_2_MD = 9;
const COL_1_LG = 2;
const COL_2_LG = 10;

export type PrintZoneFormParams = {
	printZone: PrintZonePayload,
	onChange: (printZone: PrintZonePayload) => any
};

export default function PrintZoneForm({printZone, onChange}: PrintZoneFormParams) {
	const [activeTab, setActiveTab] = useState<string>();
	const [selectedPrintPreview, setSelectedPrintPreview] = useState<PrintPreviewStub>();

	useEffect(
		() => {
			setActiveTab(DEFAULT_TAB);
		},
		[]
	);

	useEffect(
		() => {
			if (printZone.previews.length === 0) {
				setSelectedPrintPreview(undefined);
				return;
			}
			if (selectedPrintPreview === undefined) {
				setSelectedPrintPreview(printZone.previews[0]);
				return;
			}
			if (!printZone.previews.includes(selectedPrintPreview)) {
				setSelectedPrintPreview(printZone.previews[0]);
				return;
			}
		},
		[printZone, selectedPrintPreview]
	);

	const changed = useCallback(
		() => {
			printZone.previews = [...printZone.previews];
			onChange({...printZone});
		},
		[onChange, printZone]
	);

	const addPrintPreview = useCallback(
		() => {
			const preview: PrintPreviewStub = {
				printZoneId: printZone.printZone.id,
				name: 'Náhled',
				imageWidth: 0,
				imageHeight: 0,
				zoneStartX: 0,
				zoneStartY: 0,
				zoneWidth: 0,
				zoneHeight: 0

			};
			printZone.previews.push(preview);
			setSelectedPrintPreview(preview);
			changed();
		},
		[printZone, changed]
	);

	const removePrintPreview = useCallback(
		() => {
			if (!selectedPrintPreview) return;
			printZone.previews.splice(printZone.previews.indexOf(selectedPrintPreview), 1);
			changed();
		},
		[selectedPrintPreview, printZone, changed]
	);

	return (
		<div>
			<Form className="px-3 w-75">
				<Stack direction="vertical" gap={2}>
					<Row className="align-items-center">
						<Col md={COL_1_MD} lg={COL_1_LG}>
							<Form.Label>Name:</Form.Label>
						</Col>
						<Col md={COL_2_MD} lg={COL_2_LG}>
							<div>
								<Form.Control
									type="text"
									value={printZone.printZone.name}
									onChange={(e) => {
										printZone.printZone.name = e.target.value;
										changed();
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
									value={printZone.printZone.width}
									onChange={(e) => {
										printZone.printZone.width = Number(e.target.value);
										changed();
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
									value={printZone.printZone.height}
									onChange={(e) => {
										printZone.printZone.height = Number(e.target.value);
										changed();
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
													printZone.previews.map(
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
															const i = printZone.previews.indexOf(selectedPrintPreview);
															printZone.previews[i] = preview;
															setSelectedPrintPreview(preview);
															changed();
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
