import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DesignFileStub} from "../../../../types/DesignFile";
import {PrintPreviewZoneStub} from "../../../../types/PrintPreviewZone";
import {StringUtil, Vector2} from "zavadil-ts-common";
import CylinderEffect from "./CylinderEffect";
import {PIXEL_PER_MM} from "../../../../util/ImageUtil";
import {ImagezRestClientContext} from "../../../../client/imagez/ImagezClient";

export type DesignerPreviewCylinderZoneParams = {
	files: Array<DesignFileStub>;
	previewZone: PrintPreviewZoneStub;
	previewScale: number;
	zoneScale: Vector2;
	designerWidth: number;
	designerHeight: number;
	onError: (error: string) => any;
}

type FileImageUrl = {
	imageName: string;
	imageUrl: string;
}

type FileImage = {
	imageName: string;
	image: HTMLImageElement;
}

export default function DesignerPreviewCylinderZone({
	files,
	previewZone,
	previewScale,
	zoneScale,
	designerHeight,
	designerWidth,
	onError
}: DesignerPreviewCylinderZoneParams) {
	const imagezClient = useContext(ImagezRestClientContext);

	const width = useMemo(() => Math.round(previewZone.widthPx * previewScale), [previewZone, previewScale]);
	const height = useMemo(() => Math.round(previewZone.heightPx * previewScale), [previewZone, previewScale]);

	const fileNames = useMemo(
		() => files
			.filter(f => StringUtil.notBlank(f.imageName))
			.map(f => f.imageName)
			.join(';'),
		[files]
	);

	const [fileUrls, setFileUrls] = useState<Map<string, string>>(new Map());

	const loadFileUrls = useCallback(
		() => {
			if (StringUtil.isBlank(fileNames)) return;
			const names = fileNames.split(';');
			const promises: Array<Promise<FileImageUrl>> = names.map(
				(n): Promise<FileImageUrl> => imagezClient.getResizedUrl(n, 'Fit', designerWidth, designerHeight)
					.then(
						(url): FileImageUrl => {
							return {
								imageName: n,
								imageUrl: url
							}
						})
					.catch((e) => onError(String(e)))
			);
			Promise.all(promises).then(
				(fileImages) => {
					const urls: Map<string, string> = new Map();
					fileImages
						.filter(fi => fi !== undefined)
						.forEach(
							(fi) => {
								urls.set(fi.imageName, fi.imageUrl);
							}
						);
					setFileUrls(urls);
				});
		},
		[fileNames, designerWidth, designerHeight, imagezClient, onError]
	);

	useEffect(loadFileUrls, [fileNames, designerWidth, designerHeight]);

	const [fileImages, setFileImages] = useState<Map<string, HTMLImageElement>>(new Map());

	const loadFileImages = useCallback(
		() => {
			const promises: Array<Promise<FileImage>> = [];
			fileUrls.forEach(
				(url, name) => {
					const promise = new Promise<FileImage>(
						(resolve) => {
							const img = document.createElement('img');
							img.crossOrigin = "anonymous";
							img.addEventListener('load', () => resolve({imageName: name, image: img}));
							img.src = url;
						}
					);
					promises.push(promise);
				}
			);
			Promise.all(promises).then(
				(fileImages) => {
					const imgs: Map<string, HTMLImageElement> = new Map();
					fileImages.forEach(
						(fi) => {
							imgs.set(fi.imageName, fi.image);
						}
					);
					setFileImages(imgs);
				});
		},
		[fileUrls]
	);

	useEffect(loadFileImages, [fileUrls]);

	const canvas = useMemo(
		() => document.createElement('canvas'),
		[]
	);

	const canvasAsUrl = useMemo(
		() => {
			canvas.width = width;
			canvas.height = height;

			const context = canvas.getContext('2d');
			if (!context) return;

			context.clearRect(0, 0, width, height);

			files.forEach(
				(f) => {
					const img = fileImages.get(f.imageName);
					if (img) {
						context.drawImage(
							img,
							f.positionXMm * PIXEL_PER_MM * zoneScale.x,
							f.positionYMm * PIXEL_PER_MM * zoneScale.y,
							f.imageWidthMm * PIXEL_PER_MM * zoneScale.x,
							f.imageHeightMm * PIXEL_PER_MM * zoneScale.y
						);
					}
				}
			);

			return canvas.toDataURL();

		},
		[canvas, width, height, zoneScale, files, fileImages]
	);

	return (
		<div
			className="designer-preview-zone-cylinder"
			draggable={false}
			style={
				{
					top: previewZone.startYPx * previewScale,
					left: previewZone.startXPx * previewScale,
					width: width,
					height: height,
					transformStyle: 'preserve-3d',
					transform: `rotate(${previewZone.rotateDeg}deg) skewX(${previewZone.skewXDeg}deg) skewY(${previewZone.skewYDeg}deg)`
				}
			}
		>
			{
				canvasAsUrl && <CylinderEffect
					imageUrl={canvasAsUrl}
					width={width}
					height={height}
					slices={previewZone.cylinderSlices}
					verticalAngle={previewZone.cylinderVerticalAngle}
					startAngle={previewZone.cylinderStartAngle}
					endAngle={previewZone.cylinderEndAngle}
					perspective={previewZone.cylinderPerspective * previewScale}
					radius={previewZone.cylinderRadius * previewScale}
				/>
			}
		</div>
	);
}
