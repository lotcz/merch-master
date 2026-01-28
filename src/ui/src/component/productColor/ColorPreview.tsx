import React from "react";
import {ProductColorBase} from "../../types/ProductColor";

export type ColorPreviewParams = {
	color: ProductColorBase;
}

export default function ColorPreview({color}: ColorPreviewParams) {
	return <div className="d-flex align-items-center gap-2">
		<div style={{width: 25, height: 25, backgroundColor: color.color, borderRadius: 12}}>

		</div>
		<div>
			{color.name}
		</div>
	</div>
}
