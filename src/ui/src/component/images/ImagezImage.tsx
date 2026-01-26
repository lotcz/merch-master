import {useContext, useEffect, useState} from "react";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {Img} from "./Img";

export type ImagezImageProps = {
	name?: string | null;
	type: string;
	width: number;
	height: number;
	ext?: string;
	verticalAlign?: string | null;
	horizontalAlign?: string | null;
};

export function ImagezImage({name, type, width, height, ext, verticalAlign, horizontalAlign}: ImagezImageProps) {
	const restClient = useContext(MerchMasterRestClientContext);
	const [url, setUrl] = useState<string | null>(null);

	useEffect(
		() => {
			if (name) {
				restClient
					.imagez
					.getResizedUrl(name, type, width, height, ext, verticalAlign, horizontalAlign)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, name, type, width, height, ext, verticalAlign, horizontalAlign]
	);

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
