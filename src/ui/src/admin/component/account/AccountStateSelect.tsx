import {EnumSelect} from "zavadil-react-common";
import {AccountState} from "../../../shared/types/Account";

export type AccountStateSelectProps = {
	state: AccountState;
	onChange: (state: AccountState) => any;
}

export default function AccountStateSelect({state, onChange}: AccountStateSelectProps) {
	return <EnumSelect
		options={["Temporary", "Pending", "Approved", "Disabled"]}
		value={state}
		onChange={(s) => onChange(s as AccountState)}
	/>
}
