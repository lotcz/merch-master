package eu.zavadil.merchmaster.config.security;

import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.oauth.common.token.PermissionLevel;
import eu.zavadil.java.oauth.common.util.PermissionUtil;
import eu.zavadil.java.util.StringUtils;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.stream.Collectors;

public class OAuthAccessTokenAuthentication extends AbstractAuthenticationToken {

	private final JwtAccessToken token;

	public static String scopeToAuthorityName(String scope) {
		PermissionLevel level = PermissionUtil.extractPermissionLevel(scope);
		if (level != PermissionLevel.admin) return null;
		String privilege = PermissionUtil.extractPrivilege(scope);
		if (StringUtils.safeEquals(privilege, "*")) return "ROLE_ADMIN";
		if (StringUtils.safeStartsWith(privilege, "creator/")) return "ROLE_CREATOR";
		return null;
	}

	public OAuthAccessTokenAuthentication(JwtAccessToken token) {
		super(null);
		this.token = token;
		setAuthenticated(true);
	}

	@Override
	public Object getCredentials() {
		return null;
	}

	@Override
	public Object getPrincipal() {
		return this.token;
	}

	@Override
	public Collection<GrantedAuthority> getAuthorities() {
		return this.token.getScopes()
			.stream()
			.map((String scope) -> scopeToAuthorityName(scope))
			.filter((String authority) -> StringUtils.notBlank(authority))
			.map((String authority) -> new SimpleGrantedAuthority(authority))
			.collect(Collectors.toList());
	}
}
