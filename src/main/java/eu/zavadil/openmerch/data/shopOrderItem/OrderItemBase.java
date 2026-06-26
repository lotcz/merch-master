package eu.zavadil.openmerch.data.shopOrderItem;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class OrderItemBase extends EntityBase {

	double unitPrice;

	int unitCount = 1;

}
