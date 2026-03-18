import {useEffect, useState} from "react";
import {useAdminRestClient} from "../client/AdminRestClient";

function Footer() {
	const restClient = useAdminRestClient();
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		restClient
			.version()
			.then((s) => setStatus(s))
			.catch((e) => setStatus(String(e)));
	}, []);

	return <footer className="flex-fill p-3 small bg-body-secondary">{status}</footer>;
}

export default Footer;
