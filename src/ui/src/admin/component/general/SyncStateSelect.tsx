import {SyncState} from "../../../shared/types/SyncState";
import {EnumSelect} from "zavadil-react-common";

export type SyncStateSelectProps = {
	state: SyncState;
	onChange: (state: SyncState) => any;
}

export default function SyncStateSelect({state, onChange}: SyncStateSelectProps) {
	return <EnumSelect
		options={["Pending", "Synced"]}
		value={state}
		onChange={(s) => onChange(s as SyncState)}
	/>
}
