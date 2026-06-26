package eu.zavadil.openmerch.data.shopCategory;

import eu.zavadil.openmerch.data.shop.Shop;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_category")
public class ShopCategory extends ShopCategoryBase {

	@ManyToOne(optional = false)
	private Shop shop;
}
