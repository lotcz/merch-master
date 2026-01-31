import {Col, Form, Row, Stack} from "react-bootstrap";
import React, {useCallback} from "react";
import {PrintPreviewStub} from "../../types/PrintPreview";
import {ImagezUploadInput} from "../images/ImagezUploadInput";

const COL_1_MD = 3;
const COL_2_MD = 9;
const COL_1_LG = 2;
const COL_2_LG = 10;

export type PrintPreviewFormParams = {
	printPreview: PrintPreviewStub,
	onChange: (printPreview: PrintPreviewStub) => any
};

export default function PrintPreviewForm({printPreview, onChange}: PrintPreviewFormParams) {
	const changed = useCallback(
		() => {
			onChange({...printPreview});
		},
		[onChange, printPreview]
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
									value={printPreview.name}
									onChange={
										(e) => {
											printPreview.name = e.target.value;
											changed();
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
									name={printPreview.imageName}
									onSelected={
										(e) => {
											printPreview.imageName = e;
											changed();
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
					PREVIEW
				</div>
			}
		</div>
	)
}
