package eu.zavadil.merchmaster.data.creator.shop;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop", indexes = { @Index(columnList = "slug", unique = true) })
public class ShopStub extends ShopBase {

	@Column(name = "account_id", nullable = false)
	private int accountId;
}
