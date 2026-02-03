import React, {useMemo} from "react";
import {DesignPayload} from "../../../types/Design";
import {PrintZoneStub} from "../../../types/PrintZone";
import {PrintPreviewZoneStub} from "../../../types/PrintPreviewZone";
import {Vector2} from "zavadil-ts-common";
import {PIXEL_PER_MM} from "../../../util/ImageUtil";
import DesignerPreviewCylinderZone from "./cylinder/DesignerPreviewCylinderZone";
import DesignerPreviewFlatZone from "./flat/DesignerPreviewFlatZone";

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

	return previewZone.useCylinderEffect ? <DesignerPreviewCylinderZone
		previewZone={previewZone}
		files={files}
		previewScale={previewScale}
		zoneScale={zoneScale}
		designerWidth={designerWidth}
		designerHeight={designerHeight}
		onError={onError}
	/> : <DesignerPreviewFlatZone
		previewZone={previewZone}
		files={files}
		previewScale={previewScale}
		zoneScale={zoneScale}
	/>
}
