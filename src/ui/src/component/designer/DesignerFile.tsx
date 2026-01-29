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
	isSelected: boolean;
	isManipulating: boolean;
	onSelected: () => any;
	onStartMove: () => any;
	onEndMove: () => any;
	onStartResize: () => any;
	onEndResize: () => any;
}

export default function DesignerFile(
	{file, scale, onChanged, maxHeight, maxWidth, isSelected, onSelected, onStartMove, onEndMove, isManipulating}: DesignerFileParams
) {

	return (
		<div
			className={`design-file ${isSelected ? 'selected' : ''} ${isManipulating ? 'manipulating' : ''}`}
			style={
				{
					top: file.positionY * PIXEL_PER_CM * scale,
					left: file.positionX * PIXEL_PER_CM * scale,
					width: file.imageWidth * PIXEL_PER_CM * scale,
					height: file.imageHeight * PIXEL_PER_CM * scale
				}
			}
			onClick={
				() => {
					if (!isSelected) onSelected();
				}
			}
			onMouseDown={
				(e) => {
					if (!isSelected) onSelected();
					onStartMove();
				}
			}

		>
			<ImagezImage name={file.imageName} type="Fit" width={maxWidth} height={maxHeight}/>
		</div>
	)
}
