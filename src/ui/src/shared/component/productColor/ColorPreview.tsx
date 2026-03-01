import React from "react";
import {ProductColorBase} from "../../types/ProductColor";

export type ColorPreviewParams = {
	color: ProductColorBase;
}

export default function ColorPreview({color}: ColorPreviewParams) {
	return <div className="d-flex align-items-center gap-2">
		<div className="color-preview" style={{backgroundColor: color.color}}>

		</div>
		<div>
			{color.name}
		</div>
	</div>
}
