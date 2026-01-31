package eu.zavadil.merchmaster.data.productColor;

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
	name = "product_color",
	indexes = {
		@Index(columnList = "productId"),
	}
)
public class ProductColorStub extends ProductColorBase {

	@Column(name = "product_id")
	private int productId;

}
