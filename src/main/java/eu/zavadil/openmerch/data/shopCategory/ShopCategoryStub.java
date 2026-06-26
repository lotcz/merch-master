package eu.zavadil.openmerch.data.shopCategory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_category")
public class ShopCategoryStub extends ShopCategoryBase {

	@Column(name = "shop_id")
	private int shopId;

}
