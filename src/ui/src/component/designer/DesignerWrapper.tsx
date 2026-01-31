import {Alert, Button, Spinner} from "react-bootstrap";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {StringUtil} from "zavadil-ts-common";
import {DesignPayload} from "../../types/Design";
import {DesignerRestClient} from "../../client/DesignerRestClient";
import Designer from "./Designer";

export type DesignerParams = {
	uuid?: string | null;
	onFinished: (uuid: string) => any;
}

export default function DesignerWrapper({uuid, onFinished}: DesignerParams) {
	const client = useMemo(() => new DesignerRestClient(), []);

	const [design, setDesign] = useState<DesignPayload>();
	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const loadDesign = useCallback(
		() => {
			if (!uuid) {
				// create new design
				client.createNewDesign(1)
					.then(setDesign)
					.catch((e: Error) => setError(e.message));
			} else {
				// load existing
				client.loadDesign(uuid)
					.then(setDesign)
					.catch((e: Error) => setError(e.message));
			}
		},
		[uuid, client]
	);

	useEffect(loadDesign, [uuid]);

	const saveDesign = useCallback(
		(finished: boolean) => {
			if (!design) return;

			if (finished && !design.design.confirmed) design.design.confirmed = true;
			setSaving(true);

			client
				.saveDesign(design)
				.then(
					(d) => {
						if (finished) {
							if (StringUtil.isBlank(design.design.uuid)) {
								setError("No UUID assigned!");
							} else {
								onFinished(design.design.uuid);
							}
						} else {
							setDesign(d);
						}
						setChanged(false);
					})
				.catch((e: Error) => setError(e.message))
				.finally(() => setSaving(false))
		},
		[client, design, onFinished]
	);

	if (!design) {
		return <Spinner/>
	}

	return (
		<div>
			<Designer
				client={client}
				design={design}
				onChange={
					(d) => {
						setDesign(d);
						setChanged(true);
					}
				}
				onError={setError}
			/>
			{
				error && <Alert variant="danger">{error}</Alert>
			}
			<div className="text-center">
				<Button size="lg" onClick={() => saveDesign(true)}>Uložit</Button>
			</div>
		</div>
	)
}
