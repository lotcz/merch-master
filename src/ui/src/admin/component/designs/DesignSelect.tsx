import {AutocompleteSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {useCallback, useEffect, useState} from "react";
import {Design} from "../../../shared/types/Design";

export type DesignSelectProps = {
	accountId: number;
	designId?: number | null;
	onChange: (designId?: number | null) => any;
}

export default function DesignSelect({accountId, designId, onChange}: DesignSelectProps) {
	const client = useAdminRestClient();
	const [design, setDesign] = useState<Design | null>();

	const onSearch = useCallback(
		(text: string) => client.designs
			.searchByAccount(accountId, {search: text, page: 0, size: 10})
			.then((page) => page.content),
		[client, accountId]
	);

	useEffect(() => {
		if (!designId) {
			setDesign(null);
			return;
		}
		if (design?.id !== designId) {
			client.designs.loadFull(designId).then(setDesign)
		}
	}, [designId]);

	return <AutocompleteSelect
		onSearch={onSearch}
		selected={design}
		labelGetter={(d) => `${d.productColor.product.name} (${d.productColor.name})`}
		onChange={
			(c) => {
				onChange(c ? c.id : null);
				setDesign(c);
			}}
	/>
}
