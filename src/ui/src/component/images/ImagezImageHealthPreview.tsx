import {ImagezImageThumb} from "./ImagezImage";
import {ImageHealth} from "../../types/Image";

export type ImagezImageHealthPreviewProps = {
	health: ImageHealth;
	width: number;
	height: number;
};

export function ImagezImageHealthPreview({health, width, height}: ImagezImageHealthPreviewProps) {
	return <div>
		<div>
			<ImagezImageThumb name={health.name}/>
		</div>
		<div>
			{health.mime}: {health.width} x {health.height}
		</div>
	</div>
}
