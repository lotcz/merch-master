package eu.zavadil.merchmaster.data.shopOrder;

import eu.zavadil.merchmaster.data.shopCustomer.Customer;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_order")
public class Order extends OrderBase {

	@ManyToOne(optional = false)
	private Customer customer;

}
