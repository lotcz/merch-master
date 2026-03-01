import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {ImagezRestClientContext} from "../../client/imagez/ImagezClient";
import ImageUtil, {Color} from "../../util/ImageUtil";

export type ImagezImageRemoveBgProps = {
	name?: string | null;
	width: number;
	height: number;
	removeColor: Color;
	threshold: number;
};

export function ImagezImageRemoveBg({name, width, height, removeColor, threshold}: ImagezImageRemoveBgProps) {
	const restClient = useContext(ImagezRestClientContext);

	const actualWidth = useMemo(() => ImageUtil.snap(width), [width]);
	const actualHeight = useMemo(() => ImageUtil.snap(height), [height]);

	const [url, setUrl] = useState<string | null>();

	useEffect(
		() => {
			if (name) {
				restClient
					.getResizedUrl(name, 'Fit', actualWidth, actualHeight, undefined, undefined, undefined, true)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, name, actualWidth, actualHeight]
	);

	const canvas = useRef<HTMLCanvasElement>(null);
	const [img, setImg] = useState<HTMLImageElement | null>();

	useEffect(
		() => {
			if (url) {
				const im = document.createElement('img');
				im.crossOrigin = "anonymous";
				im.addEventListener('load', () => setImg(im));
				im.src = url;
			} else {
				setImg(null);
			}
		},
		[url]
	);

	const writeImage = useCallback(
		() => {
			if (!img) return;
			if (!canvas.current) return;

			const context = canvas.current.getContext('2d');
			if (!context) return;

			canvas.current.width = width;
			canvas.current.height = height;
			const cnv = ImageUtil.removeBackground(img, removeColor, threshold);
			if (cnv) {
				context.drawImage(cnv, 0, 0, width, height);
				cnv.remove();
			}
		},
		[img, canvas, removeColor, threshold, width, height]
	);

	useEffect(writeImage, [writeImage]);

	return <canvas ref={canvas}/>
}

