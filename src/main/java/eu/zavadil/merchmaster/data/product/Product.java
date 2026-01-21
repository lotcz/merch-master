package eu.zavadil.merchmaster.data.product;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Product extends EntityWithNameBase {

	private static final int NAME_SIZE = 255;

	@Column(length = NAME_SIZE)
	@Size(max = NAME_SIZE)
	private String name;

	private Integer originalWidth;

	private Integer originalHeight;

}
