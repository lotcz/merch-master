import {AutocompleteSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {useCallback} from "react";
import {ShopCustomer} from "../../../shared/types/ShopCustomer";

export type ShopCustomerSelectProps = {
	shopId: number;
	customer?: ShopCustomer | null;
	onChange: (customer?: ShopCustomer | null) => any;
}

export default function ShopCustomerByShopSelect({customer, shopId, onChange}: ShopCustomerSelectProps) {
	const client = useAdminRestClient();

	const onSearch = useCallback(
		(text: string) => client.shopCustomers
			.loadByShop(shopId, {search: text, page: 0, size: 10})
			.then((page) => page.content),
		[client, shopId]
	);

	return <AutocompleteSelect
		onSearch={onSearch}
		labelGetter={(c) => `${c.user.name} (${c.user.email})`}
		selected={customer}
		onChange={onChange}
	/>
}
