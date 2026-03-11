import {EnumSelect} from "zavadil-react-common";
import {UserState} from "../../../shared/types/User";

export type UserStateSelectProps = {
	state: UserState;
	onChange: (state: UserState) => any;
}

export default function UserStateSelect({state, onChange}: UserStateSelectProps) {
	return <EnumSelect
		options={["Temporary", "Active", "Disabled"]}
		value={state}
		onChange={(s) => onChange(s as UserState)}
	/>
}
