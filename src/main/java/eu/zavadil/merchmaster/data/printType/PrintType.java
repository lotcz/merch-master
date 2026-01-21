package eu.zavadil.merchmaster.data.printType;

import eu.zavadil.merchmaster.data.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "print_type")
public class PrintType extends PrintTypeBase {

	@ManyToOne(optional = false)
	private Product product;

}
