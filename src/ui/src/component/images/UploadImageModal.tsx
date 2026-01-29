import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Form, Modal} from 'react-bootstrap';
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import {Img} from "./Img";
import {SaveButton} from "zavadil-react-common";
import {ImageHealth} from "../../types/Image";

export type UploadImageModalProps = {
	onClose: () => any;
	onSelected: (imageName: string, imageHealth: ImageHealth) => any;
}

export function UploadImageModal({onClose, onSelected}: UploadImageModalProps) {
	const restClient = useContext(MerchMasterRestClientContext);
	const alerts = useContext(UserAlertsContext);
	const [uploading, setUploading] = useState<boolean>(false);
	const [file, setFile] = useState<File>();
	const [preview, setPreview] = useState<string>();

	useEffect(
		() => {
			if (file && file.type.startsWith("image/")) {
				setPreview(URL.createObjectURL(file));
			} else {
				setPreview(undefined);
			}
		},
		[file]
	);

	const upload = useCallback(
		() => {
			if (!file) return;
			setUploading(true);
			restClient
				.imagez
				.uploadFile(file)
				.then((ih) => onSelected(ih.name, ih))
				.catch(
					(e) => {
						setUploading(false);
						alerts.err(e);
					});
		},
		[restClient, alerts, onSelected, file]
	);

	return (
		<Modal show={true} onHide={onClose} size="xl">
			<Modal.Header closeButton className="align-items-start">
				<div>
					<Modal.Title>Upload image</Modal.Title>
				</div>
			</Modal.Header>
			<Modal.Body className="p-0">
				<div>
					<div className="p-4">
						<div className="p-2 text-center">
							{
								preview && <Img url={preview} maxHeight={600} maxWidth={800}/>
							}
						</div>
						<Form>
							<Form.Control
								type="file"
								onChange={(e) => {
									setFile(undefined);
									const filelist = (e.target as HTMLInputElement).files;
									if (!filelist) {
										alerts.err("No files selected!");
										return;
									}
									const file = filelist.item(0);
									if (!file) {
										alerts.err("No file selected!");
										return;
									}
									setFile(file);
								}}
							/>
						</Form>
					</div>
					<div className="text-center m-2">
						<SaveButton
							size="lg"
							loading={uploading}
							onClick={upload}
							disabled={file === undefined}
						>Upload</SaveButton>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}

