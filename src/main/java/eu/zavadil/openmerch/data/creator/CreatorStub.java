package eu.zavadil.openmerch.data.creator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "creator")
public class CreatorStub extends CreatorBase {

	@Column(name = "account_id", nullable = false)
	private int accountId;

	@Column(name = "user_id", nullable = false)
	private int userId;
}
