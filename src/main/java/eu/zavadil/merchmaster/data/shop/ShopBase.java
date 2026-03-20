package eu.zavadil.merchmaster.data.shop;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.merchmaster.data.SyncState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ShopBase extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private ShopState state = ShopState.Pending;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private SyncState syncState = SyncState.Pending;

	static final int SLUG_LENGTH = 50;

	/**
	 * technical name
	 */
	@Column(length = SLUG_LENGTH)
	@Size(max = SLUG_LENGTH)
	private String slug;

	public void setSlug(String name) {
		this.slug = this.truncateString(name, SLUG_LENGTH);
	}

	static final int OAUTH_AUDIENCE_LENGTH = 255;

	@Column(length = OAUTH_AUDIENCE_LENGTH)
	@Size(max = OAUTH_AUDIENCE_LENGTH)
	private String oauthAudienceName;

	public void setOauthAudienceName(String name) {
		this.oauthAudienceName = this.truncateString(name, OAUTH_AUDIENCE_LENGTH);
	}
}
