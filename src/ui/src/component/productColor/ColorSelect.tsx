import {Dropdown, Spinner} from "react-bootstrap";
import React, {useEffect} from "react";
import {ProductColorStub} from "../../types/ProductColor";
import ColorPreview from "./ColorPreview";

export type ColorSelectParams = {
	colors?: Array<ProductColorStub>;
	selectedColor?: ProductColorStub | null;
	onSelected: (color: ProductColorStub | null) => any;
}

export default function ColorSelect({selectedColor, colors, onSelected}: ColorSelectParams) {

	useEffect(
		() => {
			if (!colors) return;

			if (!selectedColor && colors.length > 0) {
				onSelected(colors[0]);
			}

			if (selectedColor && !colors.includes(selectedColor)) {
				onSelected(colors[0]);
			}
		},
		[colors, selectedColor, onSelected]
	);

	if (!colors) {
		return <Spinner/>
	}

	return (
		<Dropdown>
			<Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2 border">
				{
					selectedColor && <ColorPreview color={selectedColor}/>
				}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{
					colors.map(
						(color, index) => <Dropdown.Item
							key={index}
							eventKey={String(color.id)}
							onClick={() => onSelected(color)}
						>
							<ColorPreview color={color}/>
						</Dropdown.Item>
					)
				}
			</Dropdown.Menu>
		</Dropdown>
	)
}
