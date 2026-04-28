package eu.zavadil.merchmaster.data.shopCustomer;

import eu.zavadil.merchmaster.data.shop.Shop;
import eu.zavadil.merchmaster.data.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop_customer")
public class Customer extends CustomerBase {

	@ManyToOne(optional = false)
	private Shop shop;

	@ManyToOne(optional = false)
	private User user;
}
