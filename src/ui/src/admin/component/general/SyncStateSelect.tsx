import {usePublicRestClient} from "../../../public/client/PublicRestClient";
import EnumDynamicSelect from "../../../shared/component/general/EnumDynamicSelect";

export type SyncStateSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function SyncStateSelect({state, onChange}: SyncStateSelectProps) {
	const client = usePublicRestClient();
	return <EnumDynamicSelect
		supplier={() => client.enumerations.syncStates.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
