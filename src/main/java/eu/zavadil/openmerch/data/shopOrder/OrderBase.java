package eu.zavadil.openmerch.data.shopOrder;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import static eu.zavadil.openmerch.data.user.User.ADDRESS_FIELD_LENGTH;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class OrderBase extends EntityBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private OrderState orderState = OrderState.Cart;

	@Column(length = ADDRESS_FIELD_LENGTH)
	@Size(max = ADDRESS_FIELD_LENGTH)
	private String shippingName;

	public void setShippingName(String name) {
		this.shippingName = this.truncateString(name, ADDRESS_FIELD_LENGTH);
	}

	@Column(length = ADDRESS_FIELD_LENGTH)
	@Size(max = ADDRESS_FIELD_LENGTH)
	private String shippingStreet;

	public void setShippingStreet(String name) {
		this.shippingStreet = this.truncateString(name, ADDRESS_FIELD_LENGTH);
	}

	@Column(length = ADDRESS_FIELD_LENGTH)
	@Size(max = ADDRESS_FIELD_LENGTH)
	private String shippingCity;

	public void setShippingCity(String name) {
		this.shippingCity = this.truncateString(name, ADDRESS_FIELD_LENGTH);
	}

	private int shippingZip;

	private boolean useShippingAddress = true;

	@Column(length = ADDRESS_FIELD_LENGTH)
	@Size(max = ADDRESS_FIELD_LENGTH)
	private String billingName;

	public void setBillingName(String name) {
		this.billingName = this.truncateString(name, ADDRESS_FIELD_LENGTH);
	}

	@Column(length = ADDRESS_FIELD_LENGTH)
	@Size(max = ADDRESS_FIELD_LENGTH)
	private String billingStreet;

	public void setBillingStreet(String name) {
		this.billingStreet = this.truncateString(name, ADDRESS_FIELD_LENGTH);
	}

	@Column(length = ADDRESS_FIELD_LENGTH)
	@Size(max = ADDRESS_FIELD_LENGTH)
	private String billingCity;

	public void setBillingCity(String name) {
		this.billingCity = this.truncateString(name, ADDRESS_FIELD_LENGTH);
	}

	private int billingZip;

}
