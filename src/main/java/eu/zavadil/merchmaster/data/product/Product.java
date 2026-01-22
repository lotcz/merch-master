package eu.zavadil.merchmaster.data.product;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Product extends EntityWithNameBase {

}
