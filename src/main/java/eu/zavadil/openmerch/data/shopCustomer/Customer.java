package eu.zavadil.openmerch.data.shopCustomer;

import eu.zavadil.openmerch.data.shop.Shop;
import eu.zavadil.openmerch.data.user.User;
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
