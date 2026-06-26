package eu.zavadil.openmerch.data.design;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "design")
public class DesignStub extends DesignBase {

	@Column(name = "account_id")
	private Integer accountId;

	@Column(name = "print_type_id")
	private int printTypeId;

	@Column(name = "product_color_id")
	private int productColorId;

}
