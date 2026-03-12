import {ImagezImageThumb} from "./ImagezImage";
import {Form} from "react-bootstrap";
import {StringUtil} from "zavadil-ts-common";
import {ImageHealth} from "../../types/Image";
import {ImagezUploadButton} from "./ImagezUploadButton";

export type ImagezUploadInputProps = {
	name?: string | null;
	onSelected: (originalImageName: string, imageHealth: ImageHealth) => any;
};

export function ImagezUploadInput({name, onSelected}: ImagezUploadInputProps) {
	return <div>
		<div className="d-flex gap-2 align-items-center">
			{
				name && <ImagezImageThumb name={name}/>
			}
			<Form.Control
				type="text"
				disabled={true}
				value={StringUtil.getNonEmpty(name)}
			/>
			<ImagezUploadButton
				name="..."
				onSelected={onSelected}
			/>
		</div>
	</div>
}
