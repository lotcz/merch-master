package eu.zavadil.openmerch.data.shop;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "shop")
public class ShopStub extends ShopBase {

	@Column(name = "account_id", nullable = false)
	private int accountId;
}
