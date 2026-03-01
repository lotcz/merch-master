import React, {useCallback, useContext, useState} from "react";
import {Form, Spinner} from "react-bootstrap";
import {ImageHealth} from "../../types/Image";
import {ImagezRestClientContext} from "../../client/imagez/ImagezClient";

export type ImagezUploadButtonProps = {
	name?: string | null;
	onSelected: (imageName: string, imageHealth: ImageHealth) => any;
};

export function ImagezUploadButton({name, onSelected}: ImagezUploadButtonProps) {
	const restClient = useContext(ImagezRestClientContext);
	const [uploading, setUploading] = useState<boolean>(false);

	const upload = useCallback(
		(file: File) => {
			if (!file) return;
			setUploading(true);
			restClient
				.uploadFile(file)
				.then((ih) => onSelected(file.name, ih))
				.catch((e) => console.error(e))
				.finally(() => setUploading(false));
		},
		[restClient, onSelected]
	);

	return <div>
		<Form.Label htmlFor="image_upload_button" className="m-0">
			<div className="btn btn-primary btn-sm m-0 d-flex align-items-center gap-2">
				{
					uploading && <Spinner size="sm"/>
				}
				{name}
			</div>
		</Form.Label>
		<Form.Control
			id="image_upload_button"
			className="d-none"
			type="file"
			accept="image/*"
			onChange={(e) => {
				const filelist = (e.target as HTMLInputElement).files;
				if (!filelist) {
					return;
				}
				const file = filelist.item(0);
				if (!file) {
					return;
				}
				upload(file);
			}}
		/>
	</div>
}
