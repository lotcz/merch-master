import {Col, Container, Row, Spinner, Stack} from "react-bootstrap";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DesignPayload} from "../../types/Design";
import {PrintTypePayload} from "../../types/PrintType";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import DesignerPrintZone from "./DesignerPrintZone";
import {DesignFileStub} from "../../types/DesignFile";
import DesignerMenu from "./DesignerMenu";
import {Vector2} from "zavadil-ts-common";
import {PrintPreviewStub} from "../../types/PrintPreview";
import DesignerPreview from "./DesignerPreview";
import CylinderEffect from "./cylinder/CylinderEffect";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 350;

export type DesignerParams = {
	design: DesignPayload;
	onChange: (design: DesignPayload) => any;
	onError: (error: string) => any;
	client: DesignerRestClient;
}

export default function Designer({design, client, onChange, onError}: DesignerParams) {
	const designerAreaRef = useRef<HTMLDivElement>(null);
	const previewAreaRef = useRef<HTMLDivElement>(null);
	const [designerAreaSize, setDesignerAreaSize] = useState<Vector2>(new Vector2(MAX_WIDTH, MAX_HEIGHT));
	const [previewAreaSize, setPreviewAreaSize] = useState<Vector2>(new Vector2(MAX_WIDTH, MAX_HEIGHT));

	const updateAreaSize = useCallback(
		() => {
			if (!designerAreaRef.current) return;
			if (!previewAreaRef.current) return;
			setDesignerAreaSize(new Vector2(designerAreaRef.current.clientWidth, designerAreaRef.current.clientHeight));
			setPreviewAreaSize(new Vector2(previewAreaRef.current.clientWidth, previewAreaRef.current.clientHeight));
		},
		[designerAreaRef, previewAreaRef]
	);

	useEffect(updateAreaSize, [designerAreaRef, previewAreaRef]);

	const [printType, setPrintType] = useState<PrintTypePayload | null>();
	const [selectedFile, setSelectedFile] = useState<DesignFileStub>();
	const [previews, setPreviews] = useState<Array<PrintPreviewStub>>();

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

	const loadPreviews = useCallback(
		() => {
			if (!printType) {
				setPreviews(undefined);
				return;
			}
			client
				.loadPreviews(printType.printType.productId)
				.then(setPreviews)
				.catch((e: Error) => onError(e.message))
		},
		[client, printType, onError]
	);

	useEffect(loadPreviews, [printType]);

	if (!printType) {
		return <Spinner/>
	}

	return (
		<Container fluid className="designer">
			<Row>
				<Col md={3} lg={2}>
					<DesignerMenu
						client={client}
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
				</Col>
				<Col md={5} lg={5}>
					<Stack direction="horizontal">
						<div ref={designerAreaRef}>
							{
								printType ? printType.zones.map(
									(zone, index) => <DesignerPrintZone
										key={index}
										printZone={zone}
										design={design}
										onChange={onChange}
										maxWidth={designerAreaSize.x}
										maxHeight={MAX_HEIGHT}
										selectedFile={selectedFile}
										onFileSelected={setSelectedFile}
									/>
								) : <Spinner/>
							}
						</div>
						<div>
							<CylinderEffect
								imageUrl="http://localhost:8080/images/resized/2ff54ff4779b5270637215893ae5f557.png?width=712&type=fit&height=350&token=bc33bb45"
								width={designerAreaSize.x}
								height={MAX_HEIGHT}
								verticalAngle={-10}
								slices={7}
								radius={150}
								startAngle={-45}
								endAngle={45}
							/>
						</div>
					</Stack>
				</Col>
				<Col md={4} lg={5}>
					<div ref={previewAreaRef}>
						{
							previews ? previews.map(
								(preview, index) => <DesignerPreview
									key={index}
									preview={preview}
									design={design}
									client={client}
									zones={printType.zones}
									maxWidth={previewAreaSize.x}
									maxHeight={MAX_HEIGHT}
								/>
							) : <Spinner/>
						}
					</div>
				</Col>
			</Row>
		</Container>
	)
}
