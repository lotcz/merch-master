package eu.zavadil.merchmaster.data.user;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.merchmaster.data.SyncState;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "usr")
public class User extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private SyncState syncState = SyncState.Pending;

	private String oauthSubject;

	private String email;

	public static final int ADDRESS_FIELD_LENGTH = 100;

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
