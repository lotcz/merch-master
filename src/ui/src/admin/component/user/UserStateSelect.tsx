import EnumDynamicSelect from "../../../shared/component/general/EnumDynamicSelect";
import {usePublicRestClient} from "../../../public/client/PublicRestClient";

export type UserStateSelectProps = {
	state: string;
	onChange: (state: string) => any;
}

export default function UserStateSelect({state, onChange}: UserStateSelectProps) {
	const client = usePublicRestClient();
	return <EnumDynamicSelect
		supplier={() => client.enumerations.userStates.get()}
		value={state}
		onChange={(s) => onChange(String(s))}
	/>
}
