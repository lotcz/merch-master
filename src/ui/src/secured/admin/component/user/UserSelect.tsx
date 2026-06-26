import {AutocompleteEntityIdSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {StringUtil} from "zavadil-ts-common";

export type UserSelectProps = {
	userId?: number | null;
	onChange: (userId?: number | null) => any;
}

export default function UserSelect({userId, onChange}: UserSelectProps) {
	const restClient = useAdminRestClient();

	return <AutocompleteEntityIdSelect
		id={userId}
		onChange={onChange}
		entityClient={restClient.users}
		labelGetter={(usr) => StringUtil.isBlank(usr.name) ? usr.email : `${usr.name} (${usr.email})`}
	/>

}
