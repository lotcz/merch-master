import React from "react";
import {DesignFileStub} from "../../types/DesignFile";
import {PIXEL_PER_CM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {BsArrowDownRight, BsTrash} from "react-icons/bs";

export type DesignerFileParams = {
	file: DesignFileStub;
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
	onDeleted: () => any;
}

export default function DesignerFile(
	{
		file,
		scale,
		maxHeight,
		maxWidth,
		isSelected,
		onSelected,
		onStartMove,
		onEndMove,
		onStartResize,
		onEndResize,
		isManipulating,
		onDeleted
	}: DesignerFileParams
) {

	return (
		<div
			className={`design-file ${isSelected ? 'selected' : ''} ${isManipulating ? 'manipulating' : ''}`}
			draggable={false}
			style={
				{
					top: file.positionY * PIXEL_PER_CM * scale,
					left: file.positionX * PIXEL_PER_CM * scale,
					width: file.imageWidth * PIXEL_PER_CM * scale,
					height: file.imageHeight * PIXEL_PER_CM * scale
				}
			}
			onMouseDown={
				(e) => {
					e.stopPropagation();
					e.preventDefault();
					if (!isSelected) onSelected();
					onStartMove();
				}
			}
			onMouseUp={
				(e) => {
					onEndMove();
					onEndResize();
				}
			}

		>
			<ImagezImage name={file.imageName} type="Fit" width={maxWidth} height={maxHeight}/>
			<div
				className="delete-button"
				onMouseDown={
					(e) => {
						e.stopPropagation();
						onDeleted();
					}
				}
			>
				<BsTrash size={15}/>
			</div>
			<div
				className="resize-button"
				onMouseDown={
					(e) => {
						e.stopPropagation();
						e.preventDefault();
						onEndMove();
						onSelected();
						onStartResize();
					}
				}
			>
				<BsArrowDownRight size={12}/>
			</div>
		</div>
	)
}
