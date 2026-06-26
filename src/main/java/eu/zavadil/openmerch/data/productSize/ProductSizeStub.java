package eu.zavadil.openmerch.data.productSize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "product_size")
public class ProductSizeStub extends ProductSizeBase {

	@Column(name = "product_id")
	private int productId;

}
