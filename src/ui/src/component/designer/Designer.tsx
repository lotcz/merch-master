import {Col, Container, Row, Spinner, Stack} from "react-bootstrap";
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

export type DesignerParams = {
	design: DesignPayload;
	onChange: (design: DesignPayload) => any;
	onError: (error: string) => any;
}

export default function Designer({design, onChange, onError}: DesignerParams) {
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

	useEffect(updateAreaSize, [designerAreaRef, previewAreaRef]);

	const [printType, setPrintType] = useState<PrintTypePayload | null>();
	const [selectedFile, setSelectedFile] = useState<DesignFileStub>();

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

	if (!printType) {
		return <Spinner/>
	}

	return (
		<Container fluid className="designer">
			<Row>
				<Col md={3} lg={2}>
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
										maxHeight={DESIGNER_MAX_HEIGHT}
										selectedFile={selectedFile}
										onFileSelected={setSelectedFile}
									/>
								) : <Spinner/>
							}
						</div>
					</Stack>
				</Col>
				<Col md={4} lg={5}>
					<div ref={previewAreaRef}>
						{
							printType.previews.map(
								(preview, index) => <DesignerPreview
									key={index}
									preview={preview}
									design={design}
									productZones={printType.zones}
									maxWidth={previewAreaSize.x}
									maxHeight={DESIGNER_MAX_HEIGHT}
									onError={onError}
								/>
							)
						}
					</div>
				</Col>
			</Row>
		</Container>
	)
}
