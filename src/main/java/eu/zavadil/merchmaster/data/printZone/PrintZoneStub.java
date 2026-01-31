package eu.zavadil.merchmaster.data.printZone;

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
	name = "print_zone",
	indexes = {
		@Index(columnList = "productId"),
	}
)
public class PrintZoneStub extends PrintZoneBase {

	@Column(name = "product_id")
	private int productId;

}
