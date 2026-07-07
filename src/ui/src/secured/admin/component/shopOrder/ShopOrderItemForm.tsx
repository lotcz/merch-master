import {useContext, useEffect, useState} from "react";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import {ShopOrderItemStub} from "../../../../shared/types/ShopOrderItem";
import ShopProductSelect from "../shopProduct/ShopProductSelect";
import {ShopProduct} from "../../../../shared/types/ShopProduct";
import {Form} from "react-bootstrap";
import Money from "../../../../shared/component/general/Money";

export type ShopOrderItemFormProps = {
	shopId: number;
	item: ShopOrderItemStub;
	onChange: (item: ShopOrderItemStub) => any;
}

export default function ShopOrderItemForm({shopId, item, onChange}: ShopOrderItemFormProps) {
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [shopProduct, setShopProduct] = useState<ShopProduct | null>();

	useEffect(
		() => {
			if (!item.productId) {
				setShopProduct(undefined);
				return;
			}
			if (item.productId !== shopProduct?.id) {
				restClient.shopProducts
					.loadFull(item.productId)
					.then((p) => setShopProduct(p))
					.catch((e) => userAlerts.err(e));
			}
		},
		[item]
	);

	useEffect(
		() => {
			if (!shopProduct) {
				return;
			}
			const unitPrice = shopProduct.design.productColor.product.basePrice + shopProduct.creatorProfit;
			if (item.unitPrice !== unitPrice) {
				item.unitPrice = unitPrice;
				onChange(item);
			}
		},
		[shopProduct]
	);

	return (
		<tr>
			<td className="v-center">
				<ShopProductSelect
					shopId={shopId}
					shopProduct={shopProduct}
					onChange={
						(p) => {
							setShopProduct(p);
							item.productId = Number(p?.id);
							onChange(item);
						}
					}
				/>
			</td>
			<td className="v-center money">
				<Money amount={item.unitPrice}/>
			</td>
			<td>
				<div className="float-start">
					<Form.Control
						type="number"
						value={item.unitCount}
						onChange={
							(n) => {
								item.unitCount = Number(n.target.value);
								onChange(item);
							}
						}
					/>
				</div>
			</td>
			<td className="v-center money">
				<Money amount={item.unitCount * item.unitPrice}/>
			</td>
		</tr>
	);
}
