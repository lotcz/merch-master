import React, {MouseEvent, MouseEventHandler, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Vector2} from "zavadil-ts-common";
import {Dropdown, Form, Spinner, Stack} from "react-bootstrap";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";
import {PrintPreviewPayload} from "../../types/PrintPreview";
import {PrintPreviewZoneStub} from "../../types/PrintPreviewZone";
import {PrintZoneStub} from "../../types/PrintZone";
import {UserAlertsContext} from "../../util/UserAlerts";
import PrintPreviewDesignerZone from "./PrintPreviewDesignerZone";
import {ImagezImage} from "../images/ImagezImage";
import {Switch} from "zavadil-react-common";
import ResetableRange from "../general/ResetableRange";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 350;

export type PrintPreviewDesignerParams = {
	printPreview: PrintPreviewPayload;
	productZones: Array<PrintZoneStub>;
	onChange: (preview: PrintPreviewPayload) => any;
}

export default function PrintPreviewDesigner({
	printPreview,
	productZones,
	onChange
}: PrintPreviewDesignerParams) {
	const userAlerts = useContext(UserAlertsContext);

	const designerAreaRef = useRef<HTMLDivElement>(null);
	const [designerAreaSize, setDesignerAreaSize] = useState<Vector2>(new Vector2(MAX_WIDTH, MAX_HEIGHT));

	const updateAreaSize = useCallback(
		() => {
			if (!designerAreaRef.current) return;
			setDesignerAreaSize(new Vector2(designerAreaRef.current.clientWidth, designerAreaRef.current.clientHeight));
		},
		[designerAreaRef]
	);

	useEffect(updateAreaSize, [designerAreaRef]);

	const [selectedPreviewZone, setSelectedPreviewZone] = useState<PrintPreviewZoneStub>();

	const printZone = useMemo(
		() => {
			if (!selectedPreviewZone) return undefined;
			return productZones.find((z) => z.id === selectedPreviewZone.printZoneId);
		},
		[selectedPreviewZone, productZones]
	);

	useEffect(
		() => {
			if (!selectedPreviewZone) return;
			const selected = printPreview.zones.find((p) => p.id === selectedPreviewZone.id);
			setSelectedPreviewZone(selected);
		},
		[printPreview]
	);

	const scale = useMemo(
		() => {
			return ImageUtil.imageFitScale(
				printPreview.printPreview.imageWidthPx,
				printPreview.printPreview.imageHeightPx,
				designerAreaSize.x,
				designerAreaSize.y
			);
		},
		[printPreview, designerAreaSize]
	);

	const addPreviewZone = useCallback(
		(printZoneId: number) => {
			if (!productZones) return;
			const zone = productZones.find((z) => z.id === printZoneId);
			if (!zone) {
				userAlerts.err('No zone found!');
				return;
			}
			const zoneScale = ImageUtil.imageFitScale(
				zone.widthMm * PIXEL_PER_MM,
				zone.heightMm * PIXEL_PER_MM,
				printPreview.printPreview.imageWidthPx,
				printPreview.printPreview.imageHeightPx,
			);
			const zoneWidth = zone.widthMm * PIXEL_PER_MM * zoneScale;
			const zoneHeight = zone.heightMm * PIXEL_PER_MM * zoneScale;
			const newZone: PrintPreviewZoneStub = {
				printPreviewId: Number(printPreview.printPreview.id),
				printZoneId: printZoneId,
				widthPx: zoneWidth,
				heightPx: zoneHeight,
				startYPx: 0,
				startXPx: 0,
				rotateDeg: 0,
				skewXDeg: 0,
				skewYDeg: 0,
				aspectLocked: true,
				useCylinderEffect: false,
				cylinderVerticalAngle: -10,
				cylinderSlices: 10,
				cylinderPerspective: 1000,
				cylinderRadius: 60,
				cylinderStartAngle: -75,
				cylinderEndAngle: 75,
				useViewCrop: false,
				viewCropOffsetXMm: 0,
				viewCropOffsetYMm: 0,
				viewCropWidthMm: zone.widthMm,
				viewCropHeightMm: zone.heightMm
			};
			printPreview.zones = [...printPreview.zones, newZone];
			onChange({...printPreview});
			setSelectedPreviewZone(newZone);
		},
		[onChange, printPreview, productZones, userAlerts]
	);

	const updateZone = useCallback(
		(zone: PrintPreviewZoneStub) => {
			const newZone = {...zone};
			printPreview.zones = printPreview.zones.map(z => z === zone ? newZone : z);
			onChange({...printPreview});
			if (zone === selectedPreviewZone) setSelectedPreviewZone(newZone);
		},
		[onChange, selectedPreviewZone, printPreview]
	);

	const [isResizing, setIsResizing] = useState<boolean>(false);
	const [moveZonePositionPx, setMoveZonePositionPx] = useState<Vector2>();

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			if (!selectedPreviewZone) return;
			if (!(moveZonePositionPx || isResizing)) return;

			const pos = new Vector2(e.nativeEvent.offsetX, e.nativeEvent.offsetY).multiply(1 / scale);

			if (isResizing) {
				const width = pos.x - selectedPreviewZone.startXPx;
				const height = pos.y - selectedPreviewZone.startYPx;
				selectedPreviewZone.widthPx = width;
				selectedPreviewZone.heightPx = height;

				if (productZones && selectedPreviewZone.aspectLocked) {
					const zone = productZones.find((z) => z.id === selectedPreviewZone.printZoneId);
					if (zone) {
						const aspect = zone.widthMm / zone.heightMm;
						selectedPreviewZone.heightPx = selectedPreviewZone.widthPx / aspect;
					}
				}
			} else if (moveZonePositionPx) {
				selectedPreviewZone.startXPx = pos.x - moveZonePositionPx.x;
				selectedPreviewZone.startYPx = pos.y - moveZonePositionPx.y;
			}

			updateZone(selectedPreviewZone);
		},
		[isResizing, moveZonePositionPx, selectedPreviewZone, scale, updateZone, productZones]
	);

	if (!productZones) {
		return <Spinner/>
	}

	return (
		<div className="print-preview-designer">
			<div className="label">
				<Dropdown>
					<Dropdown.Toggle variant="primary" className="d-flex align-items-center gap-2 border">Add +</Dropdown.Toggle>
					<Dropdown.Menu>
						{
							productZones.map(
								(productZone, index) => <Dropdown.Item
									key={index}
									eventKey={String(productZone.id)}
									onClick={() => addPreviewZone(Number(productZone.id))}
								>
									{productZone.name}
								</Dropdown.Item>
							)
						}
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<Stack direction="horizontal" className="mt-2 gap-2 align-items-start">
				<div
					className={`boundary ${isResizing ? 'resizing' : ''} ${moveZonePositionPx ? 'moving' : ''}`}
					style={{
						width: printPreview.printPreview.imageWidthPx * scale,
						height: printPreview.printPreview.imageHeightPx * scale
					}}
					onMouseMove={onMouseMove}
					onMouseUp={
						(e: MouseEvent<HTMLDivElement>) => {
							setIsResizing(false);
							setMoveZonePositionPx(undefined);
						}
					}
					onMouseLeave={
						(e: MouseEvent<HTMLDivElement>) => {
							setIsResizing(false);
							setMoveZonePositionPx(undefined);
						}
					}
				>
					{
						printPreview.printPreview.imageName &&
						<ImagezImage
							name={printPreview.printPreview.imageName}
							type="Fit"
							width={designerAreaSize.x}
							height={MAX_HEIGHT}
							snap={true}
						/>
					}
					{
						printPreview.zones.map(
							(previewZone, index) => <PrintPreviewDesignerZone
								zone={productZones.find((z) => z.id === previewZone.printZoneId)}
								previewZone={previewZone}
								key={index}
								scale={scale}
								isSelected={previewZone === selectedPreviewZone}
								isManipulating={isResizing || moveZonePositionPx !== undefined}
								onSelected={() => setSelectedPreviewZone(previewZone)}
								onStartMove={setMoveZonePositionPx}
								onEndMove={() => setMoveZonePositionPx(undefined)}
								onStartResize={() => setIsResizing(true)}
								onEndResize={() => setIsResizing(false)}
								onDeleted={
									() => {
										onChange(
											{
												printPreview: printPreview.printPreview,
												zones: printPreview.zones.filter(z => z !== previewZone)
											}
										);
									}
								}
								onLockUnlock={
									() => {
										previewZone.aspectLocked = !previewZone.aspectLocked;
										if (previewZone.aspectLocked) {
											const zone = productZones.find((z) => z.id === previewZone.printZoneId);
											if (zone) {
												const aspect = zone.widthMm / zone.heightMm;
												previewZone.heightPx = previewZone.widthPx / aspect;
											}
										}
										updateZone(previewZone);
									}
								}
							/>
						)
					}
				</div>
				{
					selectedPreviewZone && printZone && <div className="print-preview-designer-zone-form">
						<Form>
							<ResetableRange
								label={`Rotate (${selectedPreviewZone.rotateDeg}°)`}
								defaultValue={0}
								value={selectedPreviewZone.rotateDeg}
								min={-180}
								max={180}
								step={0.1}
								onChange={
									(deg) => {
										selectedPreviewZone.rotateDeg = deg;
										updateZone(selectedPreviewZone);
									}
								}
							/>
							<ResetableRange
								label={`Skew X (${selectedPreviewZone.skewXDeg}°)`}
								defaultValue={0}
								value={selectedPreviewZone.skewXDeg}
								min={-180}
								max={180}
								step={0.1}
								onChange={
									(deg) => {
										selectedPreviewZone.skewXDeg = deg;
										updateZone(selectedPreviewZone);
									}
								}
							/>
							<ResetableRange
								label={`Skew Y (${selectedPreviewZone.skewYDeg}°)`}
								defaultValue={0}
								value={selectedPreviewZone.skewYDeg}
								min={-180}
								max={180}
								step={0.1}
								onChange={
									(deg) => {
										selectedPreviewZone.skewYDeg = deg;
										updateZone(selectedPreviewZone);
									}
								}
							/>
							<Form.Group>
								<Switch
									id="cylinder-effect"
									label="Cylinder Effect"
									checked={selectedPreviewZone.useCylinderEffect}
									onChange={
										(checked) => {
											selectedPreviewZone.useCylinderEffect = checked;
											updateZone(selectedPreviewZone);
										}
									}
								/>
							</Form.Group>
							{
								selectedPreviewZone.useCylinderEffect && <div className="p-2">
									<ResetableRange
										label={`Slices (${selectedPreviewZone.cylinderSlices})`}
										defaultValue={10}
										value={selectedPreviewZone.cylinderSlices}
										min={2}
										max={100}
										step={1}
										onChange={
											(value) => {
												selectedPreviewZone.cylinderSlices = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Radius (${selectedPreviewZone.cylinderRadius}px)`}
										defaultValue={60}
										value={selectedPreviewZone.cylinderRadius}
										min={1}
										max={1000}
										step={1}
										onChange={
											(value) => {
												selectedPreviewZone.cylinderRadius = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Perspective (${selectedPreviewZone.cylinderPerspective}px)`}
										defaultValue={1000}
										value={selectedPreviewZone.cylinderPerspective}
										min={0}
										max={10000}
										step={1}
										onChange={
											(value) => {
												selectedPreviewZone.cylinderPerspective = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Start (${selectedPreviewZone.cylinderStartAngle}°)`}
										defaultValue={-75}
										value={selectedPreviewZone.cylinderStartAngle}
										min={-90}
										max={90}
										step={1}
										onChange={
											(value) => {
												selectedPreviewZone.cylinderStartAngle = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`End (${selectedPreviewZone.cylinderEndAngle}°)`}
										defaultValue={75}
										value={selectedPreviewZone.cylinderEndAngle}
										min={-90}
										max={90}
										step={1}
										onChange={
											(value) => {
												selectedPreviewZone.cylinderEndAngle = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Vertical (${selectedPreviewZone.cylinderVerticalAngle}°)`}
										defaultValue={0}
										value={selectedPreviewZone.cylinderVerticalAngle}
										min={-90}
										max={90}
										step={1}
										onChange={
											(value) => {
												selectedPreviewZone.cylinderVerticalAngle = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
								</div>
							}
							<Form.Group>
								<Switch
									id="view-crop"
									label="Crop View"
									checked={selectedPreviewZone.useViewCrop}
									onChange={
										(checked) => {
											selectedPreviewZone.useViewCrop = checked;
											updateZone(selectedPreviewZone);
										}
									}
								/>
							</Form.Group>
							{
								selectedPreviewZone.useViewCrop && <div className="p-2">
									<ResetableRange
										label={`Crop Offset X (${selectedPreviewZone.viewCropOffsetXMm}mm)`}
										defaultValue={0}
										value={selectedPreviewZone.viewCropOffsetXMm}
										min={-printZone.widthMm}
										max={printZone.widthMm}
										step={0.1}
										onChange={
											(value) => {
												selectedPreviewZone.viewCropOffsetXMm = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Crop Offset Y (${selectedPreviewZone.viewCropOffsetYMm}mm)`}
										defaultValue={0}
										value={selectedPreviewZone.viewCropOffsetYMm}
										min={-printZone.heightMm}
										max={printZone.heightMm}
										step={0.1}
										onChange={
											(value) => {
												selectedPreviewZone.viewCropOffsetYMm = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Crop Width (${selectedPreviewZone.viewCropWidthMm}mm)`}
										defaultValue={printZone.widthMm}
										value={selectedPreviewZone.viewCropWidthMm}
										min={0.1}
										max={printZone.widthMm}
										step={0.1}
										onChange={
											(value) => {
												selectedPreviewZone.viewCropWidthMm = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
									<ResetableRange
										label={`Crop Height (${selectedPreviewZone.viewCropHeightMm}mm)`}
										defaultValue={printZone.heightMm}
										value={selectedPreviewZone.viewCropHeightMm}
										min={0.1}
										max={printZone.heightMm}
										step={0.1}
										onChange={
											(value) => {
												selectedPreviewZone.viewCropHeightMm = value;
												updateZone(selectedPreviewZone);
											}
										}
									/>
								</div>
							}
						</Form>
					</div>
				}
			</Stack>
		</div>
	)
}
