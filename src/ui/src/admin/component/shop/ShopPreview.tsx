import {ShopBase} from "../../../shared/types/Shop";
import ShopUtil from "../../../shared/util/ShopUtil";
import "../../../shared/style/shop.less";
import {useMemo} from "react";
import {StringUtil} from "zavadil-ts-common";
import {ImagezImageThumb} from "../../../shared/component/images/ImagezImage";

export type ShopPreviewParams = {
	shop: ShopBase;
};

export default function ShopPreview({shop}: ShopPreviewParams) {
	const style = useMemo(() => ShopUtil.getStyle(shop), [shop])

	return <div className="shop" style={style}>
		<div className="shop-header d-flex align-items-center gap-3">
			{
				StringUtil.notBlank(shop.brandImage) && <div className="shop-brand-image">
					<ImagezImageThumb name={shop.brandImage}/>
				</div>
			}
			<div className="shop-name">
				<h1>{shop.name}</h1>
			</div>
		</div>
		<div className="shop-body">
			<div>{shop.description}</div>
			<p>
				Ostatní text na e-shopu
			</p>
			<p>
				Text může mít <a href="#">odkazy</a> nebo <button type="button">tlačítka</button>
			</p>
		</div>
	</div>
}
