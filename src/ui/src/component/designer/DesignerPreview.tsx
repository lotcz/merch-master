import React, {useEffect, useMemo, useState} from "react";
import ImageUtil from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {DesignPayload} from "../../types/Design";
import {PrintPreviewPayload, PrintPreviewStub} from "../../types/PrintPreview";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import DesignerPreviewZone from "./DesignerPreviewZone";
import {PrintZoneStub} from "../../types/PrintZone";

export type DesignerPreviewParams = {
	client: DesignerRestClient;
	design: DesignPayload;
	preview: PrintPreviewStub;
	zones: Array<PrintZoneStub>;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerPreview(
	{
		client,
		design,
		preview,
		zones,
		maxHeight,
		maxWidth
	}: DesignerPreviewParams
) {
	const [previewPayload, setPreviewPayload] = useState<PrintPreviewPayload>();

	useEffect(
		() => {
			client.loadPreview(Number(preview.id))
				.then(setPreviewPayload)
		},
		[preview]
	);

	const scale = useMemo(
		() => {
			return ImageUtil.getMaxScale(
				preview.imageWidthPx,
				preview.imageHeightPx,
				maxWidth,
				maxHeight
			);
		},
		[preview, maxHeight, maxWidth]
	);

	return (
		<div
			className="designer-preview"
			draggable={false}
			style={
				{
					width: preview.imageWidthPx * scale,
					height: preview.imageHeightPx * scale
				}
			}
		>
			<ImagezImage name={preview.imageName} type="Fit" width={maxWidth} height={maxHeight}/>
			{
				previewPayload && previewPayload.zones.map(
					(previewZone) => <DesignerPreviewZone
						design={design}
						zones={zones}
						previewZone={previewZone}
						previewScale={scale}
					/>
				)
			}
		</div>
	)
}
