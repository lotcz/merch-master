package eu.zavadil.openmerch.data.shopProduct;

import eu.zavadil.openmerch.data.design.Design;
import eu.zavadil.openmerch.data.shop.Shop;
import eu.zavadil.openmerch.data.shopCategory.ShopCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_product")
public class ShopProduct extends ShopProductBase {

	@ManyToOne(optional = false)
	private Shop shop;

	@ManyToOne(optional = false)
	private Design design;

	@ManyToOne(optional = true)
	private ShopCategory category;
}
