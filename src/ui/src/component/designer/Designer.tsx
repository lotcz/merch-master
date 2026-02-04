import {Button, Col, Container, Row, Spinner, Tab, Tabs} from "react-bootstrap";
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

export type DesignerParams = {
	design: DesignPayload;
	onChange: (design: DesignPayload) => any;
	onFinished: () => any;
	onError: (error: string) => any;
}

export default function Designer({design, onChange, onError, onFinished}: DesignerParams) {
	const client = useContext(DesignerRestClientContext);
	const designerAreaRef = useRef<HTMLDivElement>(null);
	const previewAreaRef = useRef<HTMLDivElement>(null);
	const [designerAreaSize, setDesignerAreaSize] = useState<Vector2>(new Vector2(DESIGNER_MAX_WIDTH, DESIGNER_MAX_HEIGHT));
	const [previewAreaSize, setPreviewAreaSize] = useState<Vector2>(new Vector2(DESIGNER_MAX_WIDTH, DESIGNER_MAX_HEIGHT));

	const updateAreaSize = useCallback(
		() => {
			if (!designerAreaRef.current) return;
			if (!previewAreaRef.current) return;
			setDesignerAreaSize(new Vector2(designerAreaRef.current.clientWidth, designerAreaRef.current.clientHeight));
			setPreviewAreaSize(new Vector2(previewAreaRef.current.clientWidth, previewAreaRef.current.clientHeight));
		},
		[designerAreaRef, previewAreaRef]
	);

	useEffect(updateAreaSize, [updateAreaSize]);

	useEffect(
		() => {
			updateAreaSize();
			window.addEventListener('resize', updateAreaSize);
			return () => window.removeEventListener('resize', updateAreaSize)
		},
		[]
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
			updateAreaSize();
		},
		[printType, selectedZone]
	);

	const [selectedFile, setSelectedFile] = useState<DesignFileStub>();

	if (!printType) {
		return <Spinner/>
	}

	return (
		<div className="designer">
			<Container fluid>
				<Row>
					<Col md={3} xl={2}>
						<div className="card designer-shadow p-2">
							<DesignerMenu
								productId={printType.printType.productId}
								colorId={design.design.productColorId}
								printTypeId={design.design.printTypeId}
								onColorChange={
									(colorId) => {
										design.design.productColorId = colorId;
										onChange({...design});
									}
								}
								onPrintTypeChange={
									(printTypeId) => {
										design.design.printTypeId = printTypeId;
										onChange({...design});
									}
								}
								onError={onError}
							/>

						</div>
					</Col>
					<Col md={6} xl={8}>
						<div className="designer-shadow designer-main">
							<Tabs
								activeKey={String(selectedZone?.id)}
								onSelect={(key) => setSelectedZone(printType?.zones.find(z => z.id == Number(key)))}
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
										onChange={onChange}
										maxWidth={designerAreaSize.x}
										maxHeight={designerAreaSize.y - 100}
										selectedFile={selectedFile}
										onFileSelected={setSelectedFile}
									/>
								}
							</div>
						</div>
					</Col>
					<Col md={3} xl={2}>
						<div className="card designer-shadow p-2">
							<div className="previews mt-3">
								<h3>Náhled</h3>
								<div ref={previewAreaRef} className="preview-container">
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
											/>
										)
									}
								</div>
							</div>
							<div className="text-center">
								<Button
									size="lg"
									variant="success"
									onClick={onFinished}>Uložit</Button>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	)
}
