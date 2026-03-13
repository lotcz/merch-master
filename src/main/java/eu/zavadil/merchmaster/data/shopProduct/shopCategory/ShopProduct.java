package eu.zavadil.merchmaster.data.shopProduct.shopCategory;

import eu.zavadil.merchmaster.data.design.Design;
import eu.zavadil.merchmaster.data.shop.Shop;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategory;
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
