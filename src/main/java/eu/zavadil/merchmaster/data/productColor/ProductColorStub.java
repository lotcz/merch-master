package eu.zavadil.merchmaster.data.productColor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "product_color")
public class ProductColorStub extends ProductColorBase {

	@Column(name = "product_id")
	private int productId;

}
