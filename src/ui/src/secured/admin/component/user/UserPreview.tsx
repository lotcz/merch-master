import {Spinner} from "react-bootstrap";
import {Link} from "react-router";
import {useCallback, useContext, useEffect, useState} from "react";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import {User} from "../../../../shared/types/User";
import {useNavigator} from "../../../../shared/navigator/OmAppNavigator";

export type UserPreviewParams = {
	userId: number;
};

export default function UserPreview({userId}: UserPreviewParams) {
	const navigator = useNavigator();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<User>();

	const reload = useCallback(() => {
		setData(undefined);
		if (userId) {
			restClient.users
				.loadSingle(userId)
				.then(setData)
				.catch((e: Error) => userAlerts.err(e));
		}
	}, [userId, restClient, userAlerts]);

	useEffect(reload, [userId]);

	if (!data) {
		return <Spinner/>;
	}

	return <Link to={navigator.admin.users.path.detail(userId)}>{data.name}</Link>;
}
