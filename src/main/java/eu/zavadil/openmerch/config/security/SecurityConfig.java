package eu.zavadil.openmerch.config.security;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${api.base-url}")
	@Getter
	private String apiBaseUrl;

	@Value("${server.allowedOrigin}")
	@Getter
	private String allowedOrigin;

	@Autowired
	AuthenticationFilter authenticationFilter;

	@Autowired
	public SecurityConfig(AuthenticationFilter authenticationFilter) {
		this.authenticationFilter = authenticationFilter;
	}

	@Bean
	static RoleHierarchy roleHierarchy() {
		return RoleHierarchyImpl.withDefaultRolePrefix()
			.role("ADMIN").implies("USER")
			.build();
	}

	@Bean
	static MethodSecurityExpressionHandler methodSecurityExpressionHandler(RoleHierarchy roleHierarchy) {
		DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
		expressionHandler.setRoleHierarchy(roleHierarchy);
		return expressionHandler;
	}

	/**
	 * Allow all cross-origin requests.
	 *
	 * @return
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		String allowedOrigin = this.allowedOrigin;
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry
					.addMapping("/**")
					.allowedOrigins(allowedOrigin)
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
					.allowedHeaders("*");
			}
		};
	}

	/**
	 * Protect everything starting with /api except /api/status/**, /api/imagez/** and /api/designer/**
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors(c -> {
			})
			.csrf(c -> {
				c.disable();
			})
			.securityMatcher(String.format("%s/**", this.apiBaseUrl))
			.addFilterBefore(this.authenticationFilter, AuthorizationFilter.class)
			.authorizeHttpRequests(auth ->
				auth
					// Admin-only endpoint
					.requestMatchers(String.format("%s/admin/**", this.apiBaseUrl))
					.hasRole("ADMIN")
					// User endpoints (ownership enforced at method level)
					.requestMatchers(String.format("%s/user/**", this.apiBaseUrl))
					.hasAnyRole("ADMIN", "USER")
					.anyRequest()
					.permitAll()
			);
		return http.build();
	}
}
