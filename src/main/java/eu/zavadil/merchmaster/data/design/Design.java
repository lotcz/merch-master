package eu.zavadil.merchmaster.data.design;

import eu.zavadil.merchmaster.data.printType.PrintType;
import eu.zavadil.merchmaster.data.productColor.ProductColor;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "design")
public class Design extends DesignBase {

	@ManyToOne(optional = false)
	private PrintType printType;

	@ManyToOne(optional = false)
	private ProductColor productColor;
}
