import {Spinner} from "react-bootstrap";
import {Link} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import {Account} from "../../../../shared/types/Account";

export type AccountPreviewParams = {
	accountId: number;
};

export default function AccountPreview({accountId}: AccountPreviewParams) {
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Account>();

	const reload = useCallback(() => {
		setData(undefined);
		if (accountId) {
			restClient.accounts
				.loadSingle(accountId)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		}
	}, [accountId, restClient, userAlerts]);

	useEffect(reload, [accountId]);

	if (!data) {
		return <Spinner/>;
	}

	return <Link to={`/admin/accounts/detail/${accountId}`}>{data.name}</Link>;
}
