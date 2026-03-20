import {ShopBase} from "../../../shared/types/Shop";
import ShopUtil from "../../../shared/util/ShopUtil";
import "../../../shared/style/shop.less";
import {useMemo} from "react";

export type ShopPreviewParams = {
	shop: ShopBase;
};

export default function ShopPreview({shop}: ShopPreviewParams) {
	const style = useMemo(() => ShopUtil.getStyle(shop), [shop])

	return <div className="shop" style={style}>
		<div className="shop-header">
			{shop.name}
		</div>
		<div className="shop-body">
			<p>
				Ostatní text na e-shopu
			</p>
			<p>
				Text může mít <a href="#">odkazy</a> nebo <button type="button">tlačítka</button>
			</p>
		</div>
	</div>
}
