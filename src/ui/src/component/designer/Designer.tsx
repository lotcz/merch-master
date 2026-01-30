import {Col, Container, Row, Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {DesignPayload} from "../../types/Design";
import {PrintTypePayload} from "../../types/PrintType";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import DesignerPrintZone from "./DesignerPrintZone";
import {DesignFileStub} from "../../types/DesignFile";
import DesignerMenu from "./DesignerMenu";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 350;

export type DesignerParams = {
	design: DesignPayload;
	onChange: (design: DesignPayload) => any;
	onError: (error: string) => any;
	client: DesignerRestClient;
}

export default function Designer({design, client, onChange, onError}: DesignerParams) {
	const areaRef = useRef<HTMLDivElement>(null);
	const [areaWidth, setAreaWidth] = useState<number>(MAX_WIDTH);
	const [areaHeight, setAreaHeight] = useState<number>(MAX_HEIGHT);

	const updateAreaSize = useCallback(
		() => {
			if (!areaRef.current) return;
			setAreaWidth(areaRef.current.clientWidth);
			setAreaHeight(areaRef.current.clientHeight);
		},
		[areaRef]
	);

	useEffect(updateAreaSize, []);

	const [printType, setPrintType] = useState<PrintTypePayload | null | undefined>();
	const [selectedFile, setSelectedFile] = useState<DesignFileStub | undefined>();

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
						client={client}
						productId={printType?.printType.productId}
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
				<Col md={9} lg={10}>
					<div ref={areaRef}>
						{
							printType ? printType.zones.map(
								(zone) => <DesignerPrintZone
									printZone={zone}
									design={design}
									onChange={onChange}
									maxWidth={areaWidth}
									maxHeight={MAX_HEIGHT}
									selectedFile={selectedFile}
									onFileSelected={setSelectedFile}
								/>
							) : <Spinner/>
						}
					</div>
				</Col>
			</Row>
		</Container>
	)
}
