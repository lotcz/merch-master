import React, {MouseEvent, MouseEventHandler, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Vector2} from "zavadil-ts-common";
import {Button, Dropdown, Form, Spinner, Stack} from "react-bootstrap";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";
import {PrintPreviewPayload} from "../../types/PrintPreview";
import {PrintPreviewZoneStub} from "../../types/PrintPreviewZone";
import {PrintZoneStub} from "../../types/PrintZone";
import {UserAlertsContext} from "../../util/UserAlerts";
import PrintPreviewDesignerZone from "./PrintPreviewDesignerZone";
import {ImagezImage} from "../images/ImagezImage";
import {Switch} from "zavadil-react-common";

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
			return ImageUtil.getMaxScale(
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
			const zoneScale = ImageUtil.getMaxScale(
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
				cylinderEndAngle: 75
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
				<h3>{printPreview.printPreview.name}</h3>
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
					<ImagezImage name={printPreview.printPreview.imageName} type="Fit" width={designerAreaSize.x} height={MAX_HEIGHT}/>
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
					selectedPreviewZone && <div className="print-preview-designer-zone-form">
						<Form>
							<Form.Group>
								<Form.Label>
									<span>Rotate ({selectedPreviewZone.rotateDeg}°)</span>
									<Button
										size="sm"
										onClick={
											() => {
												selectedPreviewZone.rotateDeg = 0;
												updateZone(selectedPreviewZone);
											}
										}
									>Reset</Button>
								</Form.Label>
								<Form.Range
									value={selectedPreviewZone.rotateDeg}
									min={-180}
									max={180}
									step={0.1}
									onChange={
										(deg) => {
											selectedPreviewZone.rotateDeg = Number(deg.target.value);
											updateZone(selectedPreviewZone);
										}
									}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>
									<span>Skew X ({selectedPreviewZone.skewXDeg}°)</span>
								</Form.Label>
								<Form.Range
									value={selectedPreviewZone.skewXDeg}
									min={-180}
									max={180}
									step={0.1}
									onChange={
										(deg) => {
											selectedPreviewZone.skewXDeg = Number(deg.target.value);
											updateZone(selectedPreviewZone);
										}
									}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>
									<span>Skew Y ({selectedPreviewZone.skewYDeg}°)</span>
								</Form.Label>
								<Form.Range
									value={selectedPreviewZone.skewYDeg}
									min={-180}
									max={180}
									step={0.1}
									onChange={
										(deg) => {
											selectedPreviewZone.skewYDeg = Number(deg.target.value);
											updateZone(selectedPreviewZone);
										}
									}
								/>
							</Form.Group>
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
									<Form.Group>
										<Form.Label>Slices ({selectedPreviewZone.cylinderSlices})</Form.Label>
										<Form.Range
											value={selectedPreviewZone.cylinderSlices}
											min={2}
											max={100}
											onChange={
												(deg) => {
													selectedPreviewZone.cylinderSlices = Number(deg.target.value);
													updateZone(selectedPreviewZone);
												}
											}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>Radius ({selectedPreviewZone.cylinderRadius}px)</Form.Label>
										<Form.Range
											value={selectedPreviewZone.cylinderRadius}
											min={1}
											max={1000}
											onChange={
												(deg) => {
													selectedPreviewZone.cylinderRadius = Number(deg.target.value);
													updateZone(selectedPreviewZone);
												}
											}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>Perspective ({selectedPreviewZone.cylinderPerspective}°)</Form.Label>
										<Form.Range
											value={selectedPreviewZone.cylinderPerspective}
											min={0}
											max={2000}
											onChange={
												(deg) => {
													selectedPreviewZone.cylinderPerspective = Number(deg.target.value);
													updateZone(selectedPreviewZone);
												}
											}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>Start ({selectedPreviewZone.cylinderStartAngle}°)</Form.Label>
										<Form.Range
											value={selectedPreviewZone.cylinderStartAngle}
											min={-90}
											max={90}
											onChange={
												(deg) => {
													selectedPreviewZone.cylinderStartAngle = Number(deg.target.value);
													updateZone(selectedPreviewZone);
												}
											}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>End ({selectedPreviewZone.cylinderEndAngle}°)</Form.Label>
										<Form.Range
											value={selectedPreviewZone.cylinderEndAngle}
											min={-90}
											max={90}
											onChange={
												(deg) => {
													selectedPreviewZone.cylinderEndAngle = Number(deg.target.value);
													updateZone(selectedPreviewZone);
												}
											}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>Vertical ({selectedPreviewZone.cylinderVerticalAngle}°)</Form.Label>
										<Form.Range
											value={selectedPreviewZone.cylinderVerticalAngle}
											min={-90}
											max={90}
											onChange={
												(deg) => {
													selectedPreviewZone.cylinderVerticalAngle = Number(deg.target.value);
													updateZone(selectedPreviewZone);
												}
											}
										/>
									</Form.Group>
								</div>
							}
						</Form>
					</div>
				}
			</Stack>
		</div>
	)
}
