import {useContext} from "react";
import {ImagezImageThumb} from "./ImagezImage";
import {Button, Form} from "react-bootstrap";
import {StringUtil} from "zavadil-ts-common";
import {UploadImageDialogContext} from "../../util/UploadImageDialogContext";

export type ImagezUploadInputProps = {
	name?: string | null;
	onSelected: (imageName: string) => any;
};

export function ImagezUploadInput({name, onSelected}: ImagezUploadInputProps) {
	const uploadImage = useContext(UploadImageDialogContext);

	return <div>
		<div className="d-flex gap-2 align-items-center">
			<ImagezImageThumb name={name}/>
			<Form.Control
				type="text"
				disabled={true}
				value={StringUtil.getNonEmpty(name)}
			/>
			<Button
				onClick={
					() => {
						uploadImage.show(
							{
								onSelected: (i) => {
									onSelected(i);
									uploadImage.hide();
								},
								onClose: () => {
									uploadImage.hide();
								}
							}
						);
					}
				}
			>...</Button>
		</div>
	</div>
}
