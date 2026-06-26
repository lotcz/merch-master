package eu.zavadil.openmerch.data.shopOrderItem;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_order_item")
public class OrderItemStub extends OrderItemBase {

	@Column(name = "order_id")
	private int orderId;

	@Column(name = "product_id")
	private int productId;

}
