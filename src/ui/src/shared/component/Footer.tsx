import {useEffect, useState} from "react";
import {usePublicRestClient} from "../client/ImagezClient";

function Footer() {
	const restClient = usePublicRestClient();
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
