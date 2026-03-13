package eu.zavadil.merchmaster.data.shopOrderItem;

import eu.zavadil.merchmaster.data.shopOrder.Order;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_order_item")
public class OrderItem extends OrderItemBase {

	@ManyToOne(optional = false)
	private Order order;
}
