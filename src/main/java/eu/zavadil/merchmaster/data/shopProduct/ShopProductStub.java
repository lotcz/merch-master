package eu.zavadil.merchmaster.data.shopProduct;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_product")
public class ShopProductStub extends ShopProductBase {

	@Column(name = "shop_id")
	private int shopId;

	@Column(name = "design_id")
	private int designId;

	@Column(name = "category_id")
	private Integer categoryId;

}
