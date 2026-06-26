import EnumDynamicSelect from "../../../../shared/component/general/EnumDynamicSelect";
import {usePublicRestClient} from "../../../../public/client/PublicRestClient";

export type AccountStateSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function AccountStateSelect({state, onChange}: AccountStateSelectProps) {
	const client = usePublicRestClient();
	return <EnumDynamicSelect
		supplier={() => client.enumerations.accountStates.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
