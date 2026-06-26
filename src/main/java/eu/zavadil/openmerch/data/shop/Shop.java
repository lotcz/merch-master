package eu.zavadil.openmerch.data.shop;

import eu.zavadil.openmerch.data.account.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop")
public class Shop extends ShopBase {

	@ManyToOne(optional = false)
	private Account account;
}
