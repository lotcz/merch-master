import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {DesignPayload} from "../../../types/Design";
import {PrintZoneStub} from "../../../types/PrintZone";
import {PrintPreviewZoneStub} from "../../../types/PrintPreviewZone";
import {StringUtil, Vector2} from "zavadil-ts-common";
import {PIXEL_PER_MM} from "../../../util/ImageUtil";
import DesignerPreviewCylinderZone from "./cylinder/DesignerPreviewCylinderZone";
import DesignerPreviewFlatZone from "./flat/DesignerPreviewFlatZone";
import {ImagezRestClientContext} from "../../../client/imagez/ImagezClient";

type FileImageUrl = {
	imageName: string;
	imageUrl: string;
}

type FileImage = {
	imageName: string;
	image: HTMLImageElement;
}

export type DesignerPreviewZoneParams = {
	design: DesignPayload;
	zones: Array<PrintZoneStub>;
	previewZone: PrintPreviewZoneStub;
	previewScale: number;
	designerWidth: number;
	designerHeight: number;
	onError: (error: string) => any;
}

export default function DesignerPreviewZone({
	design,
	zones,
	previewZone,
	previewScale,
	designerHeight,
	designerWidth,
	onError
}: DesignerPreviewZoneParams) {
	const imagezClient = useContext(ImagezRestClientContext);

	const files = useMemo(
		() => design.files.filter((f) => f.printZoneId === previewZone.printZoneId),
		[design, previewZone]
	);

	const zone = useMemo(
		() => zones.find((z) => z.id === previewZone.printZoneId),
		[zones, previewZone]
	);

	const zoneScale: Vector2 = useMemo(
		() => {
			if (!zone) return new Vector2(1, 1);
			return new Vector2(
				previewZone.widthPx / (zone.widthMm * PIXEL_PER_MM),
				previewZone.heightPx / (zone.heightMm * PIXEL_PER_MM)
			).multiply(previewScale)
		},
		[zone, previewZone, previewScale]
	);

	const width = useMemo(
		() => {
			if (!zone) return 0;
			const ratio = previewZone.useViewCrop ? previewZone.viewCropWidthMm / zone.widthMm : 1;
			return Math.round(ratio * previewZone.widthPx * previewScale);
		},
		[previewZone, previewScale, zone]
	);

	const height = useMemo(
		() => {
			if (!zone) return 0;
			const ratio = previewZone.useViewCrop ? previewZone.viewCropHeightMm / zone.heightMm : 1;
			return Math.round(ratio * previewZone.heightPx * previewScale);
		},
		[previewZone, previewScale, zone]
	);

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
				(n): Promise<FileImageUrl> => imagezClient.getResizedUrl(
					n,
					'Fit',
					designerWidth,
					designerHeight,
					undefined,
					undefined,
					undefined,
					true
				).then(
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

	const context = useMemo(
		() => canvas.getContext('2d'),
		[canvas]
	);

	const [canvasAsUrl, setCanvasAsUrl] = useState('');

	useEffect(
		() => {
			if (!context) return;

			canvas.width = width;
			canvas.height = height;

			context.clearRect(0, 0, width, height);

			const offsetX = previewZone.useViewCrop ? previewZone.viewCropOffsetXMm : 0;
			const offsetY = previewZone.useViewCrop ? previewZone.viewCropOffsetYMm : 0;

			files.forEach(
				(f) => {
					const img = fileImages.get(f.imageName);
					if (img) {
						const x = (offsetX + f.positionXMm) * PIXEL_PER_MM * zoneScale.x;
						const y = (offsetY + f.positionYMm) * PIXEL_PER_MM * zoneScale.y;
						const w = f.imageWidthMm * PIXEL_PER_MM * zoneScale.x;
						const h = f.imageHeightMm * PIXEL_PER_MM * zoneScale.y;

						if (f.rotateDeg !== 0) {
							const tx = x + (0.5 * w);
							const ty = y + (0.5 * h);

							// Use save/restore to handle transformations cleanly
							context.save();
							context.translate(tx, ty);
							context.rotate((f.rotateDeg * Math.PI) / 180);
							context.translate(-tx, -ty);
						}

						context.drawImage(img, x, y, w, h);

						if (f.rotateDeg !== 0) {
							context.restore();
						}
					}
				}
			);

			setCanvasAsUrl(canvas.toDataURL());

		},
		[canvas, context, width, height, zoneScale, files, fileImages, previewZone]
	);

	return previewZone.useCylinderEffect ? <DesignerPreviewCylinderZone
		zoneImage={canvasAsUrl}
		previewZone={previewZone}
		previewScale={previewScale}
		width={width}
		height={height}
	/> : <DesignerPreviewFlatZone
		zoneImage={canvasAsUrl}
		previewZone={previewZone}
		previewScale={previewScale}
		width={width}
		height={height}
	/>
}
