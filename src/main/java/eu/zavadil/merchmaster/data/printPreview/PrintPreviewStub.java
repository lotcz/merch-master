package eu.zavadil.merchmaster.data.printPreview;

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
	name = "print_preview",
	indexes = {
		@Index(columnList = "productId"),
	}
)
public class PrintPreviewStub extends PrintPreviewBase {

	@Column(name = "product_id")
	private int productId;

}
