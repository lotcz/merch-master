import {Alert, Spinner} from "react-bootstrap";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {StringUtil} from "zavadil-ts-common";
import {DesignPayload} from "../../types/Design";
import Designer from "./Designer";
import {DesignerRestClientContext} from "../../client/designer/DesignerRestClient";
import {useParams} from "react-router";

export default function DesignerWrapper() {
	const client = useContext(DesignerRestClientContext);
	const {uuid} = useParams();

	const [design, setDesign] = useState<DesignPayload>();
	const [changed, setChanged] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const onFinished = useCallback(
		() => {

		},
		[]
	);

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
								onFinished();
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
		if (error) return <Alert variant="danger">{error}</Alert>
		return <Spinner/>
	}

	return (
		<div className="designer-wrapper">
			<Designer
				design={design}
				onChange={
					(d) => {
						setDesign(d);
						setChanged(true);
					}
				}
				onFinished={onFinished}
				onError={setError}
			/>
			{
				error && <div className="error">
					<Alert variant="danger">{error}</Alert>
				</div>
			}

		</div>
	)
}
