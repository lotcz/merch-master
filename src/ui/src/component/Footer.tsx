import React, {useContext, useEffect, useState} from 'react';
import {MerchMasterRestClientContext} from "../client/MerchMasterRestClient";

function Footer() {
	const restClient = useContext(MerchMasterRestClientContext);
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		restClient
			.version()
			.then((s) => setStatus(s))
			.catch((e) => setStatus(String(e)));
	}, []);

	return (
		<footer className="flex-fill p-3 small bg-body-secondary">
			{status}
		</footer>
	);
}

export default Footer;
