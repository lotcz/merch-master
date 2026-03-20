import {ShopBase} from "../types/Shop";

export default class ShopUtil {
	static getStyle(shop: ShopBase): React.CSSProperties {
		return {
			"--shop-brand-background": shop.brandBgColor,
			"--shop-brand-foreground": shop.brandFgColor,
			"--shop-brand-font": shop.brandFontFamily,
			"--shop-background": shop.backgroundColor,
			"--shop-foreground": shop.foregroundColor,
			"--shop-font": shop.fontFamily,
			"--shop-link": shop.linkColor,

		} as React.CSSProperties
	}
}
