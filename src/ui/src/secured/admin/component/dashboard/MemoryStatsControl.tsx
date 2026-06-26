import {useCallback, useContext, useEffect, useState} from "react";
import {UserAlertsContext} from "../../../../shared/util/UserAlerts";
import {Card, Placeholder} from "react-bootstrap";
import {JavaHeapControl} from "zavadil-react-common";
import {OmStats} from "../../../../shared/types/Stats";
import {usePublicRestClient} from "../../../../shared/client/ImagezClient";

function MemoryStatsControl() {
	const restClient = usePublicRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [stats, setStats] = useState<OmStats>();

	const loadStats = useCallback(() => {
		restClient
			.stats()
			.then(setStats)
			.catch((e) => userAlerts.err(e));
	}, [restClient, userAlerts]);

	useEffect(() => {
		loadStats();
		const h = setInterval(loadStats, 2000);
		return () => clearInterval(h);
	}, []);

	return (
		<Card>
			<Card.Header>
				<Card.Title>Server Memory</Card.Title>
			</Card.Header>
			<Card.Body>
				{stats ? (
					<JavaHeapControl stats={stats.javaHeap}/>
				) : (
					<Placeholder className="w-100" as="p" animation="glow">
						<Placeholder className="w-100"/>
					</Placeholder>
				)}
			</Card.Body>
		</Card>
	);
}

export default MemoryStatsControl;
