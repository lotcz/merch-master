import React, {useMemo} from "react";
import {ProductColorStub} from "../../types/ProductColor";
import ColorSelect from "./ColorSelect";
import ColorPreview from "./ColorPreview";

export type ColorSelectIdParams = {
	colors: Array<ProductColorStub>;
	id: number;
	readOnly: boolean;
	onSelected: (id: number) => any;
}

export default function ColorSelectId({id, colors, readOnly, onSelected}: ColorSelectIdParams) {
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

	if (readOnly) {
		return <ColorPreview color={color}/>
	}

	return (
		<ColorSelect
			selectedColor={color}
			onSelected={(c) => onSelected(Number(c.id))}
			colors={colors}
		/>
	)
}
