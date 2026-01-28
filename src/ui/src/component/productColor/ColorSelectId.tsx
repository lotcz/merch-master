import React, {useMemo} from "react";
import {ProductColorStub} from "../../types/ProductColor";
import ColorSelect from "./ColorSelect";

export type ColorSelectIdParams = {
	colors?: Array<ProductColorStub>;
	id?: number | null;
	onSelected: (id?: number | null) => any;
}

export default function ColorSelectId({id, colors, onSelected}: ColorSelectIdParams) {

	const color = useMemo(
		() => {
			if (!colors) return undefined;
			if (!id) return undefined;
			return colors.find((c) => c.id === id);
		},
		[colors, id]
	);

	return (
		<ColorSelect
			selectedColor={color}
			onSelected={(color) => onSelected(color?.id)}
			colors={colors}
		/>
	)
}
