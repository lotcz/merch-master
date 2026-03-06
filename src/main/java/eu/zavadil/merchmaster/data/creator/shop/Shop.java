package eu.zavadil.merchmaster.data.creator.shop;

import eu.zavadil.merchmaster.data.creator.account.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "account")
public class Shop extends ShopBase {

	@ManyToOne(optional = false)
	private Account account;
}
