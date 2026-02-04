import React, {useMemo} from "react";
import ImageUtil from "../../../util/ImageUtil";
import {ImagezImage} from "../../images/ImagezImage";
import {DesignPayload} from "../../../types/Design";
import {PrintPreviewPayload} from "../../../types/PrintPreview";
import {PrintZoneStub} from "../../../types/PrintZone";
import DesignerPreviewZone from "./DesignerPreviewZone";

export type DesignerPreviewParams = {
	design: DesignPayload;
	preview: PrintPreviewPayload;
	productZones: Array<PrintZoneStub>;
	onError: (error: string) => any;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerPreview({
	design,
	preview,
	productZones,
	maxHeight,
	maxWidth,
	onError
}: DesignerPreviewParams) {
	const scale = useMemo(
		() => {
			return ImageUtil.getMaxScale(
				preview.printPreview.imageWidthPx,
				preview.printPreview.imageHeightPx,
				maxWidth,
				maxHeight
			);
		},
		[preview, maxHeight, maxWidth]
	);

	const previewWidth = useMemo(() => Math.round(preview.printPreview.imageWidthPx * scale), [preview, scale]);
	const previewHeight = useMemo(() => Math.round(preview.printPreview.imageHeightPx * scale), [preview, scale]);

	return (
		<div className="designer-preview-wrapper">
			<div className="text-center"><strong>{preview.printPreview.name}</strong></div>
			<div
				className="designer-preview"
				draggable={false}
				style={
					{
						width: previewWidth,
						height: previewHeight
					}
				}
			>
				<ImagezImage name={preview.printPreview.imageName} type="Fit" width={maxWidth} height={maxHeight}/>
				{
					preview.zones.map(
						(previewZone, index) => <DesignerPreviewZone
							key={index}
							design={design}
							zones={productZones}
							previewZone={previewZone}
							previewScale={scale}
							designerWidth={previewWidth}
							designerHeight={previewHeight}
							onError={onError}
						/>
					)
				}
				{
					preview.printPreview.foregroundName && <div className="foreground">
						<ImagezImage name={preview.printPreview.foregroundName} type="Fit" width={maxWidth} height={maxHeight}/>
					</div>
				}
			</div>
		</div>
	)
}
