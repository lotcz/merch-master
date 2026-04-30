import {AutocompleteSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {useCallback, useEffect, useState} from "react";
import {ShopProduct} from "../../../shared/types/ShopProduct";

export type ShopCustomerSelectProps = {
	shopId: number;
	shopProductId?: number | null;
	onChange: (shopProductId?: number | null) => any;
}

export default function ShopProductSelect({shopProductId, shopId, onChange}: ShopCustomerSelectProps) {
	const client = useAdminRestClient();
	const [shopProduct, setShopProduct] = useState<ShopProduct | null>();

	useEffect(
		() => {
			if (shopProductId && shopProduct?.id !== shopProductId) {
				client.shopProducts.loadFull(shopProductId).then(setShopProduct);
			}
		},
		[shopProductId]
	);

	const onSearch = useCallback(
		(text: string) => client.shopProducts
			.loadByShop(shopId, {search: text, page: 0, size: 10})
			.then((page) => page.content),
		[client, shopId]
	);

	return <AutocompleteSelect
		onSearch={onSearch}
		labelGetter={(p) => `${p.name}`}
		selected={shopProduct}
		onChange={
			(shopProduct) => {
				setShopProduct(shopProduct);
				onChange(shopProduct?.id);
			}}
	/>
}
