package eu.zavadil.merchmaster.data.printType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "print_type",
	indexes = {
		@Index(columnList = "productId"),
	}
)
public class PrintTypeStub extends PrintTypeBase {

	@Column(name = "product_id")
	private int productId;

}
