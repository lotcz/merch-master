package eu.zavadil.merchmaster.data.admin.printPreview;

import eu.zavadil.merchmaster.data.admin.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "print_preview")
public class PrintPreview extends PrintPreviewBase {

	@ManyToOne(optional = false)
	private Product product;

}
