package eu.zavadil.openmerch.data.shopOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_order")
public class OrderStub extends OrderBase {

	@Column(name = "customer_id", nullable = false)
	private int customerId;

}
