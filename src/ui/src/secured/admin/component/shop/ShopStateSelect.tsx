import {usePublicRestClient} from "../../../../public/client/PublicRestClient";
import EnumDynamicSelect from "../../../../shared/component/general/EnumDynamicSelect";

export type ShopStateSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function ShopStateSelect({state, onChange}: ShopStateSelectProps) {
	const client = usePublicRestClient();
	return <EnumDynamicSelect
		supplier={() => client.enumerations.shopStates.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
