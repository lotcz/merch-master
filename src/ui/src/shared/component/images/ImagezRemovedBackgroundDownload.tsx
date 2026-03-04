import { useContext, useMemo } from "react";
import { ImagezRestClientContext } from "../../client/ImagezClient";
import { Spinner } from "react-bootstrap";

export type ImagezRemovedBackgroundDownloadProps = {
	name: string;
	hex: string;
	threshold: number;
	label?: string;
};

export function ImagezRemovedBackgroundDownload({ label, name, hex, threshold }: ImagezRemovedBackgroundDownloadProps) {
	const restClient = useContext(ImagezRestClientContext);
	const url = useMemo(() => restClient.getRemoveBackgroundUrl(name, hex, threshold), [restClient, name, hex, threshold]);

	if (!url) return <Spinner size="sm" />;

	return (
		<a href={url} target="_blank" rel="noreferrer">
			{label || name}
		</a>
	);
}
