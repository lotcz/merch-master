import {AutocompleteSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {useCallback, useEffect, useState} from "react";
import {ShopCustomer} from "../../../../shared/types/ShopCustomer";

export type ShopCustomerSelectProps = {
	shopId: number;
	disabled?: boolean;
	customerId?: number | null;
	onChange: (customerId?: number | null) => any;
}

export default function ShopCustomerByShopSelect({customerId, disabled, shopId, onChange}: ShopCustomerSelectProps) {
	const client = useAdminRestClient();
	const [customer, setCustomer] = useState<ShopCustomer | null>();

	useEffect(
		() => {
			if (customerId && customer?.id !== customerId) {
				client.shopCustomers.loadFull(customerId).then(setCustomer);
			}
		},
		[customerId]
	);

	const onSearch = useCallback(
		(text: string) => client.shopCustomers
			.loadByShop(shopId, {search: text, page: 0, size: 10})
			.then((page) => page.content),
		[client, shopId]
	);

	return <AutocompleteSelect
		onSearch={onSearch}
		disabled={disabled}
		labelGetter={(c) => `${c.user.name} (${c.user.email})`}
		selected={customer}
		onChange={
			(shopCustomer: ShopCustomer | null) => {
				setCustomer(shopCustomer);
				onChange(shopCustomer?.id);
			}
		}
	/>
}
