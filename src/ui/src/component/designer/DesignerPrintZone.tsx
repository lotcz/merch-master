import React, {useMemo} from "react";
import {PrintZonePayload} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import {NumberUtil} from "zavadil-ts-common";
import DesignerFile from "./DesignerFile";

const PIXEL_PER_CM = 100;

export type DesignerPrintZoneParams = {
	printZone: PrintZonePayload;
	design: DesignPayload;
	onChanged: (design: DesignPayload) => any;
	maxWidth: number;
	maxHeight: number;
}

export default function DesignerPrintZone({printZone, design, maxWidth, maxHeight, onChanged}: DesignerPrintZoneParams) {
	const widthCm = useMemo(
		() => NumberUtil.round(printZone.printZone.width / 10, 1),
		[printZone]
	);

	const heightCm = useMemo(
		() => NumberUtil.round(printZone.printZone.height / 10, 1),
		[printZone]
	);

	const scale = useMemo(
		() => {
			const width = widthCm * PIXEL_PER_CM;
			const height = heightCm * PIXEL_PER_CM;

			const wScale = Math.min(maxWidth / width, 1);
			const hScale = Math.min(maxHeight / height, 1);

			return Math.min(wScale, hScale);
		},
		[widthCm, heightCm, maxHeight, maxWidth]
	);

	const files = useMemo(
		() => design.files.filter(f => f.printZoneId === printZone.printZone.id),
		[design, printZone]
	)

	return (
		<div className="print-zone">
			<div className="label">
				<h3>{printZone.printZone.name}</h3>
				({widthCm} x {heightCm} cm)
			</div>
			<div className="boundary" style={{width: widthCm * PIXEL_PER_CM * scale, height: heightCm * PIXEL_PER_CM * scale}}>
				{
					files.map(
						(f) => <DesignerFile
							file={f}
							scale={scale}
							onChanged={
								(f) => {
									onChanged({design: {...design.design}, files: [...files]})
								}
							}
						/>
					)
				}
			</div>
		</div>
	)
}
