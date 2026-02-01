import React, {MouseEvent} from "react";
import {BsArrowDownRight, BsLock, BsTrash, BsUnlock} from "react-icons/bs";
import {Vector2} from "zavadil-ts-common";
import {PrintPreviewZoneStub} from "../../types/PrintPreviewZone";
import {PrintZoneStub} from "../../types/PrintZone";

export type PrintPreviewDesignerZoneParams = {
	zone?: PrintZoneStub;
	previewZone: PrintPreviewZoneStub;
	scale: number;
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

export default function PrintPreviewDesignerZone(
	{
		zone,
		previewZone,
		scale,
		isSelected,
		onSelected,
		onStartMove,
		onEndMove,
		onStartResize,
		onEndResize,
		isManipulating,
		onDeleted,
		onLockUnlock
	}: PrintPreviewDesignerZoneParams
) {

	return (
		<div
			className={`print-preview-designer-zone ${isSelected ? 'selected' : ''} ${isManipulating ? 'manipulating' : ''}`}
			draggable={false}
			style={
				{
					top: previewZone.startYPx * scale,
					left: previewZone.startXPx * scale,
					width: previewZone.widthPx * scale,
					height: previewZone.heightPx * scale
				}
			}
			onMouseDown={
				(e: MouseEvent<HTMLDivElement>) => {
					e.stopPropagation();
					e.preventDefault();
					if (!isSelected) onSelected();
					const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / scale);
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
			<div className="label">
				{zone?.name}
			</div>
			<div
				className="action-button delete-button"
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
				className={`action-button aspect-lock-button ${previewZone.aspectLocked ? 'locked' : 'unlocked'}`}
				onMouseDown={
					(e) => {
						e.stopPropagation();
						e.preventDefault();
						onLockUnlock();
					}
				}
			>
				{
					previewZone.aspectLocked ? <BsLock size={20}/> : <BsUnlock size={20}/>
				}
			</div>
			<div
				className="action-button resize-button"
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
