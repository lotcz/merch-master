package eu.zavadil.openmerch.data.shop;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.openmerch.data.SyncState;
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

	private String description;

	/* DESIGN */

	static final int COLOR_LENGTH = 20;

	static final int FONT_FAMILY_LENGTH = 255;

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String backgroundColor;

	public void setBackgroundColor(String color) {
		this.backgroundColor = this.truncateString(color, COLOR_LENGTH);
	}

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String foregroundColor;

	public void setForegroundColor(String color) {
		this.foregroundColor = this.truncateString(color, COLOR_LENGTH);
	}

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String linkColor;

	public void setLinkColor(String color) {
		this.linkColor = this.truncateString(color, COLOR_LENGTH);
	}

	@Column(length = FONT_FAMILY_LENGTH)
	@Size(max = FONT_FAMILY_LENGTH)
	private String fontFamily;

	public void setFontFamily(String family) {
		this.fontFamily = this.truncateString(family, FONT_FAMILY_LENGTH);
	}

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String brandBgColor;

	public void setBrandBgColor(String color) {
		this.brandBgColor = this.truncateString(color, COLOR_LENGTH);
	}

	@Column(length = COLOR_LENGTH)
	@Size(max = COLOR_LENGTH)
	private String brandFgColor;

	public void setBrandFgColor(String color) {
		this.brandFgColor = this.truncateString(color, COLOR_LENGTH);
	}

	String brandImage;

	boolean brandShowName = true;

	@Column(length = FONT_FAMILY_LENGTH)
	@Size(max = FONT_FAMILY_LENGTH)
	private String brandFontFamily;

	public void setBrandFontFamily(String family) {
		this.brandFontFamily = this.truncateString(family, FONT_FAMILY_LENGTH);
	}

}
