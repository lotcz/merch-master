import React, {MouseEvent} from "react";
import {DesignFileStub} from "../../types/DesignFile";
import {PIXEL_PER_MM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {BsArrowDownRight, BsLock, BsTrash, BsUnlock} from "react-icons/bs";
import {Vector2} from "zavadil-ts-common";

export type DesignerFileParams = {
	file: DesignFileStub;
	scale: number;
	maxWidth: number;
	maxHeight: number;
	isSelected: boolean;
	isManipulating: boolean;
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
		maxHeight,
		maxWidth,
		isSelected,
		onSelected,
		onStartMove,
		onEndMove,
		onStartResize,
		onEndResize,
		isManipulating,
		onDeleted,
		onLockUnlock
	}: DesignerFileParams
) {

	return (
		<div
			className={`design-file ${isSelected ? 'selected' : ''} ${isManipulating ? 'manipulating' : ''}`}
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
					e.stopPropagation();
					e.preventDefault();
					if (!isSelected) onSelected();
					const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / (PIXEL_PER_MM * scale));
					console.log(pos.toString());
					onStartMove(pos);
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
				<BsTrash size={20}/>
			</div>
			<div
				className={`aspect-lock-button ${file.aspectLocked ? 'locked' : 'unlocked'}`}
				onMouseDown={
					(e) => {
						e.stopPropagation();
						e.preventDefault();
						onLockUnlock();
					}
				}
			>
				{
					file.aspectLocked ? <BsLock size={20}/> : <BsUnlock size={20}/>
				}
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
