package eu.zavadil.merchmaster.data.admin.productColor;

import eu.zavadil.merchmaster.data.admin.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "product_color")
public class ProductColor extends ProductColorBase {

	@ManyToOne(optional = false)
	private Product product;
}
