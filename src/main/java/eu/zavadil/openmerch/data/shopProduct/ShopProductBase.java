package eu.zavadil.openmerch.data.shopProduct;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ShopProductBase extends EntityWithNameBase {

	private boolean visible;

	private double creatorProfit;

	private String description;

}
