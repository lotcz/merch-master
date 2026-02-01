import React, {MouseEvent, MouseEventHandler, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Vector2} from "zavadil-ts-common";
import {Dropdown, Spinner} from "react-bootstrap";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";
import {PrintPreviewPayload} from "../../types/PrintPreview";
import {PrintPreviewZoneStub} from "../../types/PrintPreviewZone";
import {PrintZoneStub} from "../../types/PrintZone";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import PrintPreviewDesignerZone from "./PrintPreviewDesignerZone";
import {ImagezImage} from "../images/ImagezImage";

const MAX_WIDTH = 800;
const MAX_HEIGHT = 350;

export type PrintPreviewDesignerParams = {
	printPreview: PrintPreviewPayload;
	onChange: (preview: PrintPreviewPayload) => any;
}

export default function PrintPreviewDesigner({
	printPreview,
	onChange
}: PrintPreviewDesignerParams) {
	const restClient = useContext(MerchMasterRestClientContext);
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

	const [productZones, setProductZones] = useState<Array<PrintZoneStub>>();

	const effectiveProductId = useMemo(
		() => printPreview.printPreview.productId,
		[printPreview]
	);

	const loadZones = useCallback(
		() => {
			restClient.printZones
				.loadByProduct(effectiveProductId)
				.then(setProductZones);
		},
		[restClient, effectiveProductId]
	);

	useEffect(loadZones, [effectiveProductId]);

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
				aspectLocked: true
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
		</div>
	)
}
