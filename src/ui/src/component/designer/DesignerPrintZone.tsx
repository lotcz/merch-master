import React, {useState} from "react";
import {PrintZonePayload} from "../../types/PrintZone";
import {DesignPayload} from "../../types/Design";
import {DesignFileStub} from "../../types/DesignFile";

export type DesignerPrintZoneParams = {
	printZone: PrintZonePayload;
	design: DesignPayload;
	onChanged: (design: DesignPayload) => any;
}

export default function DesignerPrintZone({printZone, design, onChanged}: DesignerPrintZoneParams) {
	const [files, setFiles] = useState<DesignFileStub>();

	return (
		<div>
			<div>{printZone.printZone.name}</div>
			<div>

			</div>
		</div>
	)
}
