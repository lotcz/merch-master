import {useContext, useEffect, useMemo, useState} from "react";
import {Img} from "./Img";
import {ImagezRestClientContext} from "../../client/imagez/ImagezClient";
import {Spinner} from "react-bootstrap";
import ImageUtil from "../../util/ImageUtil";

export type ImagezImageProps = {
	name?: string | null;
	type: string;
	width: number;
	height: number;
	ext?: string;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
	snap?: boolean;
};

export function ImagezImage({name, type, width, height, ext, snap = false, verticalAlign, horizontalAlign}: ImagezImageProps) {
	const restClient = useContext(ImagezRestClientContext);
	const [url, setUrl] = useState<string | null>();

	const actualWidth = useMemo(() => snap ? ImageUtil.snap(width) : width, [width, snap]);
	const actualHeight = useMemo(() => snap ? ImageUtil.snap(height) : height, [height, snap]);

	useEffect(
		() => {
			if (name) {
				restClient
					.getResizedUrl(name, type, actualWidth, actualHeight, ext, verticalAlign, horizontalAlign)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, name, type, actualWidth, actualHeight, ext, verticalAlign, horizontalAlign]
	);

	if (!url) return <Spinner size="sm"/>

	return <Img url={url} maxWidth={width} maxHeight={height}/>
}

export type ImagezImageResizedProps = {
	name?: string | null;
};

export function ImagezImageThumb({name}: ImagezImageResizedProps) {
	return <ImagezImage
		name={name}
		type="Fit"
		width={75}
		height={50}

	/>
}

export function ImagezImagePreview({name}: ImagezImageResizedProps) {
	return <ImagezImage
		name={name}
		type="Fit"
		width={600}
		height={200}
	/>
}
