import React, {useState} from "react";
import {DesignFileStub} from "../../types/DesignFile";

export type DesignerFileParams = {
	file: DesignFileStub;
	onChanged: (file: DesignFileStub) => any;
}

export default function DesignerFile({file, onChanged}: DesignerFileParams) {
	const [files, setFiles] = useState<DesignFileStub>();

	return (
		<div>
			<div>{file.imageName}</div>
			<div>

			</div>
		</div>
	)
}
