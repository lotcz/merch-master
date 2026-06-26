import {AutocompleteSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {useCallback} from "react";
import {ShopProduct} from "../../../../shared/types/ShopProduct";

export type ShopCustomerSelectProps = {
	shopId: number;
	shopProduct?: ShopProduct | null;
	onChange: (shopProduct?: ShopProduct | null) => any;
}

export default function ShopProductSelect({shopId, shopProduct, onChange}: ShopCustomerSelectProps) {
	const client = useAdminRestClient();

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
		onChange={onChange}
	/>
}
