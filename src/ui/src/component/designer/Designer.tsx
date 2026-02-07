import {Alert, Button, Col, Container, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {DesignPayload} from "../../types/Design";
import {PrintTypePayload} from "../../types/PrintType";
import {DesignerRestClientContext} from "../../client/designer/DesignerRestClient";
import DesignerPrintZone from "./DesignerPrintZone";
import {DesignFileStub} from "../../types/DesignFile";
import DesignerMenu from "./DesignerMenu";
import {Vector2} from "zavadil-ts-common";
import DesignerPreview from "./preview/DesignerPreview";
import {DESIGNER_MAX_HEIGHT, DESIGNER_MAX_WIDTH} from "../../util/ImageUtil";
import {PrintZoneStub} from "../../types/PrintZone";
import {PrintPreviewPayload} from "../../types/PrintPreview";
import {LoadingButton} from "zavadil-react-common";
import {DesignerAdminZone} from "./DesignerAdminZone";

export type DesignerParams = {
	design: DesignPayload;
	saving: boolean;
	changed: boolean;
	readOnly: boolean;
	admin: boolean;
	onChange: (design: DesignPayload) => any;
	onFinished: () => any;
	onCancel: () => any;
	onError: (error: string) => any;
}

export default function Designer({
	design,
	saving,
	changed,
	readOnly,
	admin,
	onChange,
	onError,
	onFinished,
	onCancel
}: DesignerParams) {
	const client = useContext(DesignerRestClientContext);
	const fullPreviewAreaRef = useRef<HTMLDivElement>(null);
	const designerAreaRef = useRef<HTMLDivElement>(null);
	const previewAreaRef = useRef<HTMLDivElement>(null);
	const [fullPreviewAreaSize, setFullPreviewAreaSize] = useState<Vector2>(new Vector2(DESIGNER_MAX_WIDTH, DESIGNER_MAX_HEIGHT));
	const [designerAreaSize, setDesignerAreaSize] = useState<Vector2>(new Vector2(DESIGNER_MAX_WIDTH, DESIGNER_MAX_HEIGHT));
	const [previewAreaSize, setPreviewAreaSize] = useState<Vector2>(new Vector2(DESIGNER_MAX_WIDTH, DESIGNER_MAX_HEIGHT));

	const updateAreaSizes = useCallback(
		() => {
			if (designerAreaRef.current) {
				setDesignerAreaSize(new Vector2(designerAreaRef.current.clientWidth, designerAreaRef.current.clientHeight));
			}
			if (previewAreaRef.current) {
				setPreviewAreaSize(new Vector2(previewAreaRef.current.clientWidth, previewAreaRef.current.clientHeight));
			}
			if (fullPreviewAreaRef.current) {
				setFullPreviewAreaSize(new Vector2(fullPreviewAreaRef.current.clientWidth, fullPreviewAreaRef.current.clientHeight));
			}
		},
		[designerAreaRef, previewAreaRef]
	);

	useEffect(
		() => {
			updateAreaSizes();
			window.addEventListener('resize', updateAreaSizes);
			return () => window.removeEventListener('resize', updateAreaSizes)
		},
		[updateAreaSizes]
	);

	const [printType, setPrintType] = useState<PrintTypePayload | null>();

	const loadPrintType = useCallback(
		() => {
			const currentPrintTypeId = printType?.printType.id;
			if (design.design.printTypeId === currentPrintTypeId) {
				return;
			}
			client
				.loadPrintType(design.design.printTypeId)
				.then(setPrintType)
				.catch((e: Error) => onError(e.message))
		},
		[client, printType, design, onError]
	);

	useEffect(loadPrintType, [design]);

	const [selectedZone, setSelectedZone] = useState<PrintZoneStub>();

	useEffect(
		() => {
			if (selectedZone === undefined || !printType?.zones.includes(selectedZone)) {
				setSelectedZone(printType?.zones[0]);
			}
			updateAreaSizes();
		},
		[printType, selectedZone, updateAreaSizes]
	);

	const [selectedFile, setSelectedFile] = useState<DesignFileStub>();

	const updateFile = useCallback(
		(file: DesignFileStub) => {
			const newFile = {...file};
			design.files = design.files.map(f => f === file ? newFile : f);
			onChange({...design});
			if (file === selectedFile) setSelectedFile(newFile);
		},
		[design, onChange, selectedFile]
	);

	const [selectedPreview, setSelectedPreview] = useState<PrintPreviewPayload>();

	if (!printType) {
		return <Spinner/>
	}

	return (
		<div className="designer">
			{
				selectedPreview ? <div className="preview-full card designer-shadow" onClick={() => setSelectedPreview(undefined)}>
						<div className="d-flex justify-content-end cursor-pointer">
							<Button variant="link" size="sm" onClick={() => setSelectedPreview(undefined)}>Zavřít náhled</Button>
						</div>
						<div ref={fullPreviewAreaRef} className="preview-full-container">
							<DesignerPreview
								preview={selectedPreview}
								design={design}
								productZones={printType.zones}
								maxWidth={fullPreviewAreaSize.x}
								maxHeight={fullPreviewAreaSize.y}
								onError={onError}
							/>
						</div>
					</div>
					:
					<Container fluid>
						<Row>
							<Col md={3} xl={2}>
								<div className="card designer-shadow p-2">
									<DesignerMenu
										productId={printType.printType.productId}
										design={design}
										readOnly={readOnly}
										admin={admin}
										selectedFile={selectedFile}
										selectedZone={selectedZone}
										onChange={onChange}
										onFileSelected={setSelectedFile}
										onUpdateFile={updateFile}
										onError={onError}
									/>
									{
										readOnly && <div className="text-small mt-2">
											<Alert variant="danger">Objednávka je odeslána, design již nelze měnit.</Alert>
										</div>
									}
									{
										admin && <DesignerAdminZone design={design} printType={printType}/>
									}
								</div>
							</Col>
							<Col md={6} xl={8} className="mt-2 mt-md-0">
								<div className="designer-shadow designer-main">
									<Tabs
										activeKey={String(selectedZone?.id)}
										onSelect={(key) => setSelectedZone(printType?.zones.find(z => z.id === Number(key)))}
									>
										{
											printType ? printType.zones.map(
												(zone, index) => <Tab
													key={index}
													title={zone.name}
													eventKey={String(zone.id)}

												/>
											) : <Spinner/>
										}
									</Tabs>
									<div ref={designerAreaRef} className="designer-tab">
										{
											selectedZone &&
											<DesignerPrintZone
												printZone={selectedZone}
												design={design}
												maxWidth={designerAreaSize.x - Math.min(100, designerAreaSize.x / 20)}
												maxHeight={designerAreaSize.y - Math.max(50, Math.min(100, designerAreaSize.y / 20))}
												selectedFile={selectedFile}
												readOnly={readOnly}
												onChange={onChange}
												onUpdateFile={updateFile}
												onFileSelected={setSelectedFile}
											/>
										}
									</div>
								</div>
							</Col>
							<Col md={3} xl={2} className="mt-2 mt-md-0">
								<div className="previews-section card designer-shadow p-2">
									<div ref={previewAreaRef} className="previews">
										<div className="preview-container">
											{
												printType.previews.map(
													(preview, index) => <DesignerPreview
														key={index}
														preview={preview}
														design={design}
														productZones={printType.zones}
														maxWidth={previewAreaSize.x}
														maxHeight={previewAreaSize.y}
														onError={onError}
														onClick={() => setSelectedPreview(preview)}
													/>
												)
											}
										</div>
									</div>
									<div className="text-small">Info: náhledy tisku jsou pouze orientační.</div>
									<div className="preview-action">
										{
											readOnly ? <Button onClick={onCancel}>Zavřít</Button>
												: <LoadingButton
													loading={saving}
													disabled={!changed}
													size="lg"
													variant="success"
													onClick={onFinished}>Uložit</LoadingButton>
										}
									</div>
								</div>
							</Col>
						</Row>
					</Container>
			}
		</div>
	)
}
