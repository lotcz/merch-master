import React, {useMemo} from "react";
import {ProductColorStub} from "../../types/ProductColor";
import ColorSelect from "./ColorSelect";

export type ColorSelectIdParams = {
	colors: Array<ProductColorStub>;
	id: number;
	onSelected: (id: number) => any;
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

	if (!color) {
		return <span>NO COLOR!</span>
	}

	return (
		<ColorSelect
			selectedColor={color}
			onSelected={(c) => onSelected(Number(c.id))}
			colors={colors}
		/>
	)
}
