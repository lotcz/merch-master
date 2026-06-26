package eu.zavadil.openmerch.data.productSize;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ProductSizeBase extends EntityWithNameBase {

	private double extraPrice;
}
