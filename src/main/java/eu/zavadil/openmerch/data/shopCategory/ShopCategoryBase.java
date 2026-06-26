package eu.zavadil.openmerch.data.shopCategory;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ShopCategoryBase extends EntityWithNameBase {

	private boolean visible;

}
