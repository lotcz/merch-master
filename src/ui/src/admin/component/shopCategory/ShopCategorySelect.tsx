import {AutocompleteSelect} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {useCallback, useEffect, useState} from "react";
import {ShopCategory} from "../../../shared/types/ShopCategory";

export type ShopCategorySelectProps = {
	shopId: number;
	categoryId?: number | null;
	onChange: (categoryId?: number | null) => any;
}

export default function ShopCategorySelect({shopId, categoryId, onChange}: ShopCategorySelectProps) {
	const client = useAdminRestClient();
	const [category, setCategory] = useState<ShopCategory | null>();

	const onSearch = useCallback(
		(text: string) => client.shopCategories
			.loadByShop(shopId, {search: text, page: 0, size: 10})
			.then((page) => page.content),
		[client, shopId]
	);

	useEffect(() => {
		if (!categoryId) {
			setCategory(null);
			return;
		}
		if (category?.id !== categoryId) {
			client.shopCategories.loadFull(categoryId).then(setCategory)
		}
	}, [categoryId]);

	return <AutocompleteSelect
		onSearch={onSearch}
		selected={category}
		onChange={
			(c) => {
				onChange(c ? c.id : null);
				setCategory(c);
			}}
	/>
}
