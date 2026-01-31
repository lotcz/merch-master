import React, {useEffect, useMemo, useState} from "react";
import ImageUtil, {PIXEL_PER_MM} from "../../util/ImageUtil";
import {ImagezImage} from "../images/ImagezImage";
import {DesignPayload} from "../../types/Design";
import {PrintPreviewPayload, PrintPreviewStub} from "../../types/PrintPreview";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import DesignerPreviewZone from "./DesignerPreviewZone";

export type DesignerPreviewParams = {
	client: DesignerRestClient;
	design: DesignPayload;
	preview: PrintPreviewStub;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerPreview(
	{
		client,
		design,
		preview,
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
				preview.imageWidthPx * PIXEL_PER_MM,
				preview.imageHeightPx * PIXEL_PER_MM,
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
					width: preview.imageWidthPx * PIXEL_PER_MM * scale,
					height: preview.imageHeightPx * PIXEL_PER_MM * scale
				}
			}
		>
			<ImagezImage name={preview.imageName} type="Fit" width={maxWidth} height={maxHeight}/>
			{
				previewPayload && previewPayload.zones.map(
					(previewZone) => <DesignerPreviewZone
						design={design}
						previewZone={previewZone}
						scale={scale}
					/>
				)
			}
		</div>
	)
}
