import React from "react";
import {DesignFileStub} from "../../types/DesignFile";
import {PIXEL_PER_CM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";

export type DesignerFileParams = {
	file: DesignFileStub;
	onChanged: (file: DesignFileStub) => any;
	scale: number;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerFile({file, scale, onChanged, maxHeight, maxWidth}: DesignerFileParams) {

	return (
		<div
			className="design-file"
			style={
				{
					top: file.positionY * PIXEL_PER_CM * scale,
					left: file.positionX * PIXEL_PER_CM * scale,
					width: file.imageWidth * PIXEL_PER_CM * scale,
					height: file.imageHeight * PIXEL_PER_CM * scale
				}
			}
		>
			<div>
				<ImagezImage name={file.imageName} type="Fit" width={maxWidth} height={maxHeight}/>
			</div>
		</div>
	)
}
