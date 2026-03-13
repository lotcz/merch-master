package eu.zavadil.merchmaster.data.shopCustomer;

import eu.zavadil.merchmaster.data.creator.CreatorBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_customer")
public class CustomerStub extends CreatorBase {

	@Column(name = "shop_id", nullable = false)
	private int shopId;

	@Column(name = "user_id", nullable = false)
	private int userId;
}
