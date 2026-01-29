import {Dropdown, Spinner} from "react-bootstrap";
import React from "react";
import {ProductColorStub} from "../../types/ProductColor";
import ColorPreview from "./ColorPreview";

export type ColorSelectParams = {
	colors?: Array<ProductColorStub>;
	selectedColor?: ProductColorStub | null;
	onSelected: (color: ProductColorStub | null) => any;
}

export default function ColorSelect({selectedColor, colors, onSelected}: ColorSelectParams) {

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
