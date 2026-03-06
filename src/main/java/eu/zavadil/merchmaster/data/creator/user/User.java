package eu.zavadil.merchmaster.data.creator.user;

import eu.zavadil.merchmaster.data.creator.account.Account;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "usr")
public class User extends UserBase {

	@ManyToOne(optional = false)
	private Account account;
}
