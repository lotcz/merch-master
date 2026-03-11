import {EnumSelect} from "zavadil-react-common";
import {ShopState} from "../../../shared/types/Shop";

export type ShopStateSelectProps = {
	state: ShopState;
	onChange: (state: ShopState) => any;
}

export default function ShopStateSelect({state, onChange}: ShopStateSelectProps) {
	return <EnumSelect
		options={["Pending", "Approved", "Disabled"]}
		value={state}
		onChange={(s) => onChange(s as ShopState)}
	/>
}
