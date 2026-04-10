import React, {MouseEvent, useCallback, useEffect, useMemo, useRef} from "react";
import {DesignFileStub} from "../../../types/DesignFile";
import ImageUtil, {PIXEL_PER_MM} from "../../../util/ImageUtil";
import {ImagezImage} from "../../images/ImagezImage";
import {BsArrowDownRight, BsTrash} from "react-icons/bs";
import {Vector2} from "zavadil-ts-common";
import {ImagezImageRemoveBg} from "../../images/ImagezImageRemoveBg";

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
	const containerRef = useRef<HTMLDivElement>(null);
	const removeBgColor = useMemo(() => ImageUtil.hexToColor(file.removeBackgroundColor), [file]);

	const width = useMemo(() => Math.round(file.imageWidthMm * PIXEL_PER_MM * scale), [file, scale]);
	const height = useMemo(() => Math.round(file.imageHeightMm * PIXEL_PER_MM * scale), [file, scale]);

	const startMoving = useCallback(
		(coords: Vector2) => {
			if (readOnly) return;
			if (!isSelected) onSelected();
			const pos = coords.multiply(1 / (PIXEL_PER_MM * scale));
			onStartMove(pos);
		},
		[readOnly, scale, onStartMove, isSelected, onSelected]
	);

	const endMoving = useCallback(
		() => {
			if (readOnly) return;
			onEndMove();
			onEndResize();
		},
		[onEndMove, onEndResize, readOnly]
	);

	// register touch events
	useEffect(
		() => {
			const el = containerRef.current;
			if (!el) return;

			const onTouchStart = (e: TouchEvent) => {
				console.log('touched');
				e.stopPropagation();
				e.preventDefault();
				const touch = e.touches[0];
				if (!touch) return;
				console.log('started');
				const rect = el.getBoundingClientRect();
				startMoving(new Vector2(touch.clientX - rect.left, touch.clientY - rect.top));
			}

			const onTouchEnd = () => {
				endMoving();
			}

			// @ts-ignore
			el.addEventListener("touchstart", onTouchStart, {passive: false});
			el.addEventListener("touchend", onTouchEnd);

			return () => {
				// @ts-ignore
				el.removeEventListener("touchstart", onTouchStart);
				el.removeEventListener("touchend", onTouchEnd);
			};
		},
		[containerRef, startMoving, endMoving]
	);

	return (
		<div
			ref={containerRef}
			className={`design-file ${isSelected ? 'selected' : ''} ${isManipulating ? 'manipulating' : ''} ${readOnly ? 'read-only' : ''}`}
			draggable={false}
			style={
				{
					top: file.positionYMm * PIXEL_PER_MM * scale,
					left: file.positionXMm * PIXEL_PER_MM * scale,
					width: width,
					height: height,
					rotate: `${file.rotateDeg}deg`
				}
			}
			onMouseDown={
				(e: MouseEvent<HTMLDivElement>) => {
					e.stopPropagation();
					e.preventDefault();
					startMoving(new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY));
				}
			}
			onMouseUp={endMoving}

		>
			{
				removeBgColor ?
					<ImagezImageRemoveBg
						name={file.imageName}
						removeColor={removeBgColor}
						threshold={file.removeBackgroundThreshold}
						width={width}
						height={height}
					/> :
					<ImagezImage
						name={file.imageName}
						type="Fit"
						width={width}
						height={height}
						snap={true}
					/>
			}
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
