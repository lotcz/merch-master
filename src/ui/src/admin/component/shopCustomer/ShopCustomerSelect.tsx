import {useAdminRestClient} from "../../client/AdminRestClient";
import {useEffect, useState} from "react";
import {ShopCustomer} from "../../../shared/types/ShopCustomer";
import {Stack} from "react-bootstrap";
import ShopSelect from "../shop/ShopSelect";
import ShopCustomerByShopSelect from "./ShopCustomerByShopSelect";
import {FormRow} from "zavadil-react-common";

export type ShopCustomerSelectProps = {
	customerId?: number | null;
	onChange: (customerId?: number | null) => any;
}

export default function ShopCustomerSelect({customerId, onChange}: ShopCustomerSelectProps) {
	const client = useAdminRestClient();
	const [shopId, setShopId] = useState<number | null>();
	const [customer, setCustomer] = useState<ShopCustomer | null>();

	useEffect(
		() => {
			if (customerId && customer?.id !== customerId) {
				client.shopCustomers.loadFull(customerId).then(setCustomer);
			}
			if (customer) {
				setShopId(customer.shop.id);
			}
		},
		[customerId, customer]
	);

	return <Stack direction="horizontal" gap={2}>
		<FormRow label="Shop:">
			<ShopSelect shopId={shopId} onChange={setShopId}/>
		</FormRow>
		{
			shopId && <>
				<FormRow label="Customer:">
					<ShopCustomerByShopSelect
						shopId={shopId}
						customer={customer}
						onChange={
							(c) => {
								setCustomer(c);
								if (c && c.id !== customerId) {
									onChange(c.id);
								}
							}
						}
					/>
				</FormRow>
			</>
		}
	</Stack>
}
