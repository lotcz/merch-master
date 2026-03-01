import {useContext, useEffect, useState} from "react";
import {ImagezRestClientContext} from "../../client/imagez/ImagezClient";
import {Spinner} from "react-bootstrap";

export type ImagezDownloadLinkProps = {
	name: string;
	label?: string;
}

export function ImagezDownloadLink({label, name}: ImagezDownloadLinkProps) {
	const restClient = useContext(ImagezRestClientContext);
	const [url, setUrl] = useState<string | null>();

	useEffect(
		() => {
			if (name) {
				restClient
					.getOrignalUrl(name)
					.then(setUrl);
			} else {
				setUrl(null);
			}
		},
		[restClient, name]
	);

	if (!url) return <Spinner size="sm"/>

	return <a href={url} target="_blank" rel="noreferrer">{label || name}</a>
}
