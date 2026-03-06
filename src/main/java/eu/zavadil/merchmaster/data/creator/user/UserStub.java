package eu.zavadil.merchmaster.data.creator.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "usr")
public class UserStub extends UserBase {

	@Column(name = "account_id", nullable = false)
	private int accountId;
}
