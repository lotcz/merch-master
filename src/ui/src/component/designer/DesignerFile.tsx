import React, {MouseEvent} from "react";
import {DesignFileStub} from "../../types/DesignFile";
import {PIXEL_PER_MM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {BsArrowDownRight, BsTrash} from "react-icons/bs";
import {Vector2} from "zavadil-ts-common";

export type DesignerFileParams = {
	file: DesignFileStub;
	scale: number;
	maxWidth: number;
	maxHeight: number;
	isSelected: boolean;
	isManipulating: boolean;
	readOnly: boolean;
	onSelected: () => any;
	onStartMove: (pos: Vector2) => any;
	onEndMove: () => any;
	onStartResize: () => any;
	onEndResize: () => any;
	onDeleted: () => any;
	onLockUnlock: () => any;
}

export default function DesignerFile(
	{
		file,
		scale,
		isSelected,
		isManipulating,
		readOnly,
		onSelected,
		onStartMove,
		onEndMove,
		onStartResize,
		onEndResize,
		onDeleted,
		onLockUnlock
	}: DesignerFileParams
) {

	return (
		<div
			className={`design-file ${isSelected ? 'selected' : ''} ${isManipulating ? 'manipulating' : ''} ${readOnly ? 'read-only' : ''}`}
			draggable={false}
			style={
				{
					top: file.positionYMm * PIXEL_PER_MM * scale,
					left: file.positionXMm * PIXEL_PER_MM * scale,
					width: file.imageWidthMm * PIXEL_PER_MM * scale,
					height: file.imageHeightMm * PIXEL_PER_MM * scale
				}
			}
			onMouseDown={
				(e: MouseEvent<HTMLDivElement>) => {
					if (readOnly) return;
					e.stopPropagation();
					e.preventDefault();
					if (!isSelected) onSelected();
					const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / (PIXEL_PER_MM * scale));
					onStartMove(pos);
				}
			}
			onMouseUp={
				(e) => {
					if (readOnly) return;
					onEndMove();
					onEndResize();
				}
			}

		>
			<ImagezImage name={file.imageName} type="Fit" width={file.imageWidthMm * PIXEL_PER_MM * scale}
						 height={file.imageHeightMm * PIXEL_PER_MM * scale} snap={true}/>
			<div
				className="action-button delete-button"
				onMouseDown={
					(e) => {
						if (readOnly) return;
						e.stopPropagation();
						onDeleted();
					}
				}
			>
				<BsTrash size={20}/>
			</div>
			<div
				className="action-button resize-button"
				onMouseDown={
					(e) => {
						if (readOnly) return;
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
