package eu.zavadil.openmerch.data.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.openmerch.data.SyncState;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "usr")
public class User extends EntityWithNameBase {

	private String email;

	private Instant lastSuccessfulLogin;

	private Instant lastFailedLogin;

	private Instant lastLinkSent;

	final static int MAX_FAILED_LOGIN_ATTEMPTS = 100;

	private int failedLoginAttempts = 0;

	public void setFailedLoginAttempts(int failedLoginAttempts) {
		this.failedLoginAttempts = failedLoginAttempts;
		if (this.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
			this.setActive(false);
		}
	}

	@JsonProperty(value = "isActive")
	private boolean active;

	@JsonProperty(value = "isAdmin")
	private boolean admin;

	@JsonIgnore
	public String getRoleName() {
		return this.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER";
	}

	static final int ALGORITHM_LENGTH = 10;

	@JsonIgnore
	@Column(length = ALGORITHM_LENGTH)
	@Size(max = ALGORITHM_LENGTH)
	private String passwordAlgorithm;

	public void setPasswordAlgorithm(String algorithm) {
		this.passwordAlgorithm = this.truncateString(algorithm, ALGORITHM_LENGTH);
	}

	static final int HASH_LENGTH = 255;

	@JsonIgnore
	@Column(length = HASH_LENGTH)
	@Size(max = HASH_LENGTH)
	private String passwordHash;

	public void setPasswordHash(String hash) {
		this.passwordHash = this.truncateString(hash, HASH_LENGTH);
	}

	public static final int SALT_LENGTH = 100;

	@JsonIgnore
	@Column(length = SALT_LENGTH)
	@Size(max = SALT_LENGTH)
	private String passwordSalt;

	public void setPasswordSalt(String salt) {
		this.passwordSalt = this.truncateString(salt, SALT_LENGTH);
	}

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
