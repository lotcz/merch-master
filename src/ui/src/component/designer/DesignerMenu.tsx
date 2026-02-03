import {Form, Spinner} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {PrintTypeStub} from "../../types/PrintType";
import {DesignerRestClientContext} from "../../client/designer/DesignerRestClient";
import {Product} from "../../types/Product";
import {EntityWithNameIdSelect} from "zavadil-react-common";
import {ProductColorStub} from "../../types/ProductColor";
import ColorSelectId from "../productColor/ColorSelectId";

export type DesignerMenuParams = {
	productId: number;
	colorId: number;
	printTypeId: number;
	onColorChange: (colorId: number) => any;
	onPrintTypeChange: (printTypeId: number) => any;
	onError: (error: string) => any;
}

export default function DesignerMenu({productId, colorId, printTypeId, onPrintTypeChange, onColorChange, onError}: DesignerMenuParams) {
	const client = useContext(DesignerRestClientContext);
	const [product, setProduct] = useState<Product>();

	const loadProduct = useCallback(
		() => {
			client
				.loadProduct(productId)
				.then(setProduct)
				.catch((e: Error) => onError(e.message))
		},
		[client, productId, onError]
	);

	useEffect(loadProduct, [productId]);

	const [printTypes, setPrintTypes] = useState<Array<PrintTypeStub>>();

	const loadPrintTypes = useCallback(
		() => {
			client
				.loadPrintTypesByProduct(productId)
				.then(setPrintTypes)
				.catch((e: Error) => onError(e.message))
		},
		[client, productId, onError]
	);

	useEffect(loadPrintTypes, [productId]);

	const [colors, setColors] = useState<Array<ProductColorStub>>();

	const loadColors = useCallback(
		() => {
			client
				.loadColorsByProduct(productId)
				.then(setColors)
				.catch((e: Error) => onError(e.message))
		},
		[client, productId, onError]
	);

	useEffect(loadColors, [productId]);

	return (
		<Form>
			<Form.Group>
				<Form.Label title="Produkt">Produkt</Form.Label>
				<div>
					{
						product ? <strong>{product.name}</strong>
							: <Spinner size="sm"/>
					}
				</div>
			</Form.Group>
			<Form.Group>
				<Form.Label title="Barva">Barva</Form.Label>
				{
					colors ? <ColorSelectId
							id={colorId}
							onSelected={onColorChange}
							colors={colors}
						/>
						: <Spinner/>
				}
			</Form.Group>
			<Form.Group>
				<Form.Label title="Druh potisku">Druh potisku</Form.Label>
				{
					printTypes ? <EntityWithNameIdSelect
							id={printTypeId}
							onChange={
								(printTypeId) => {
									if (printTypeId) onPrintTypeChange(printTypeId);
								}
							}
							options={printTypes}
						/>
						: <Spinner/>
				}
			</Form.Group>
		</Form>

	)
}
