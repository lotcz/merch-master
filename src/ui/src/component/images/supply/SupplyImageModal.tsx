import React, {useCallback, useContext, useState} from 'react';
import {Modal} from 'react-bootstrap';
import {NumberUtil, StringUtil} from "zavadil-ts-common";
import {Image} from "../../../types/Image";
import {MerchMasterRestClientContext} from "../../../client/MerchMasterRestClient";
import {WnUserAlertsContext} from "../../../util/WnUserAlerts";
import {SupplyImageUpload} from "./SupplyImageUpload";
import {ImagezImage} from "../ImagezImage";

export type SupplyImageModalProps = {
	description?: string | null;
	onClose: () => any;
	onSelected: (imageId: number) => any;
	entityType?: string | null;
	entityId?: number | null;
}

export function SupplyImageModal({onClose, onSelected, description, entityType, entityId}: SupplyImageModalProps) {
	const restClient = useContext(MerchMasterRestClientContext);
	const alerts = useContext(WnUserAlertsContext);
	const [preview, setPreview] = useState<string>();

	const saveImage = useCallback(
		(image: Image) => {
			if (StringUtil.isBlank(image.name)) {
				alerts.err("Image name empty!")
				return;
			}
			restClient
				.images
				.save(image)
				.then(
					(saved) => {
						if (NumberUtil.notEmpty(saved.id)) {
							onSelected(saved.id);
						} else {
							alerts.err("Image ID empty!")
							return;
						}
					});
		},
		[restClient, alerts, onSelected]
	);

	return (
		<Modal show={true} onHide={onClose} size="xl">
			<Modal.Header closeButton className="align-items-start">
				<div>
					<Modal.Title>Supply an image</Modal.Title>
					{
						description && <div>{description}</div>
					}
				</div>
			</Modal.Header>
			<Modal.Body className="p-0">
				<div className="p-2">
					<SupplyImageUpload
						onSelected={
							(name) => {
								setPreview(name);
							}
						}
					/>
					<ImagezImage name={preview} type="fit" width={300} height={300}/>
				</div>
			</Modal.Body>
		</Modal>
	);
}

