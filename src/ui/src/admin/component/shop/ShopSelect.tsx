import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";

export type ShopSelectProps = {
	shopId?: number | null;
	onChange: (shopId?: number | null) => any;
}

export default function ShopSelect({shopId, onChange}: ShopSelectProps) {
	const client = useAdminRestClient();

	return <AutocompleteEntityIdSelect
		id={shopId}
		entityClient={client.shops}
		onChange={onChange}
	/>
}
