package eu.zavadil.openmerch.data.creator;

import eu.zavadil.openmerch.data.account.Account;
import eu.zavadil.openmerch.data.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "creator")
public class Creator extends CreatorBase {

	@ManyToOne(optional = false)
	private Account account;

	@ManyToOne(optional = false)
	private User user;
}
