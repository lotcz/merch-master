import {Alert, Button, Spinner, Stack} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DesignPayload} from "../../types/Design";
import Designer from "./Designer";
import {DesignerRestClientContext} from "../../client/designer/DesignerRestClient";
import {useParams, useSearchParams} from "react-router";
import {UploadImageDialogContext, UploadImageDialogContextContent} from "../../util/UploadImageDialogContext";
import {UploadImageModal, UploadImageModalProps} from "../images/UploadImageModal";
import {StringUtil} from "zavadil-ts-common";

export default function DesignerWrapper() {
	const client = useContext(DesignerRestClientContext);
	const {uuid, productId} = useParams();
	const [searchParams] = useSearchParams();
	const [design, setDesign] = useState<DesignPayload>();
	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const readOnly: boolean = useMemo(() => StringUtil.getNonEmpty(searchParams.get('readOnly')) === '1', [searchParams]);
	const admin: boolean = useMemo(() => StringUtil.getNonEmpty(searchParams.get('admin')) === '1', [searchParams]);

	const [uploadImageDialog, setUploadImageDialog] = useState<UploadImageModalProps>();

	const uploadImageDialogContext = useMemo<UploadImageDialogContextContent>(
		() => {
			return {
				show: (props: UploadImageModalProps) => setUploadImageDialog(props),
				hide: () => setUploadImageDialog(undefined)
			}
		},
		[]
	);

	const loadDesign = useCallback(
		() => {
			if (!uuid) {
				// create new design
				if (!productId) {
					setError("No design UUID or productId provided!");
					return;
				}
				client.createNewDesign(Number(productId))
					.then(setDesign)
					.catch((e: Error) => setError(e.message));
			} else {
				// load existing
				client.loadDesign(uuid)
					.then(setDesign)
					.catch((e: Error) => setError(e.message));
			}
		},
		[uuid, productId, client]
	);

	useEffect(loadDesign, [uuid, productId]);

	const saveDesign = useCallback(
		(finished: boolean) => {
			if (!design) return Promise.reject('No design to save!');

			if (design.files.length === 0) return Promise.reject('Není nahrán vlastní obrázek!');

			if (finished && !design.design.confirmed) design.design.confirmed = true;
			setSaving(true);

			return client
				.saveDesign(design)
				.then(
					(d) => {
						setDesign(d);
						setChanged(false);
						return d;
					})
				.catch((e: Error) => {
					setError(e.message);
					return Promise.reject("Saving failed!");
				})
				.finally(() => setSaving(false))
		},
		[client, design]
	);

	const onFinished = useCallback(
		() => {
			saveDesign(true)
				.then(
					(d) => {
						window.parent.postMessage(
							{type: 'DESIGN_SAVE', payload: {uuid: d.design.uuid}},
							StringUtil.getNonEmpty(searchParams.get('parent_origin'))
						);
					}
				)
				.catch((e) => setError(e));
		},
		[saveDesign, searchParams]
	);

	const onCancel = useCallback(
		() => {
			window.parent.postMessage(
				{type: 'DESIGN_CANCEL'},
				StringUtil.getNonEmpty(searchParams.get('parent_origin'))
			);
		},
		[searchParams]
	);

	if (!design) {
		if (error) return <Alert variant="danger">{error}</Alert>
		return <Spinner/>
	}

	return (
		<UploadImageDialogContext.Provider value={uploadImageDialogContext}>
			<div className="designer-wrapper">
				<Designer
					design={design}
					saving={saving}
					changed={changed}
					readOnly={readOnly}
					admin={admin}
					onChange={
						(d) => {
							setDesign(d);
							setChanged(true);
						}
					}
					onFinished={onFinished}
					onCancel={onCancel}
					onError={setError}
				/>
				{
					uploadImageDialog && <UploadImageModal {...uploadImageDialog} />
				}
				{
					error && <div className="error">
						<Alert variant="danger">
							<Stack direction="horizontal" className="align-items-center gap-2">
								<div>{error}</div>
								<Button size="sm" onClick={() => setError(undefined)}>ok</Button>
							</Stack>
						</Alert>
					</div>
				}
			</div>
		</UploadImageDialogContext.Provider>
	)
}
