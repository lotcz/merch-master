import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";

export type AccountSelectProps = {
	accountId?: number | null;
	onChange: (accountId?: number | null) => any;
}

export default function AccountSelect({accountId, onChange}: AccountSelectProps) {
	const restClient = useAdminRestClient();

	return <AutocompleteEntityIdSelect
		id={accountId}
		onChange={onChange}
		entityClient={restClient.accounts}
	/>

}
