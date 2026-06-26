import EnumDynamicSelect from "../../../../shared/component/general/EnumDynamicSelect";
import {usePublicRestClient} from "../../../../public/client/PublicRestClient";

export type OrderStateSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function OrderStateSelect({state, onChange}: OrderStateSelectProps) {
	const client = usePublicRestClient();
	return <EnumDynamicSelect
		supplier={() => client.enumerations.orderStates.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
