package eu.zavadil.merchmaster.service;

import eu.zavadil.java.oauth.client.admin.OAuthAdminClient;
import eu.zavadil.java.oauth.client.admin.payload.Audience;
import eu.zavadil.java.oauth.common.token.PermissionLevel;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.SyncState;
import eu.zavadil.merchmaster.data.creator.Creator;
import eu.zavadil.merchmaster.data.shop.Shop;
import eu.zavadil.merchmaster.data.shopCustomer.Customer;
import eu.zavadil.merchmaster.data.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class OAuthSyncService {

	@Value("${oauth.self-name}")
	String oauthAudience;

	@Autowired
	OAuthAdminClient oAuthClient;

	@Autowired
	UsersService usersService;

	@Autowired
	CreatorsService creatorsService;

	@Autowired
	CustomersService customersService;

	@Autowired
	ShopsService shopsService;

	public void syncUser(User user) {
		try {
			eu.zavadil.java.oauth.client.admin.payload.User oauthUser = StringUtils.isBlank(user.getOauthSubject())
				? new eu.zavadil.java.oauth.client.admin.payload.User()
				: this.oAuthClient.loadUserBySubject(user.getOauthSubject());

			Creator creator = this.creatorsService.loadByUserId(user.getId());
			List<Customer> customers = this.customersService.loadByUserId(user.getId());

			boolean isCreator = creator != null && creator.getUserState().isActive();
			boolean isCustomer = customers.stream().anyMatch(c -> c.getUserState().isActive());

			// sync user
			oauthUser.setActive(isCreator || isCustomer);
			oauthUser.setName(user.getName());
			oauthUser.setEmail(user.getEmail());
			oauthUser = this.oAuthClient.saveUser(oauthUser);

			// sync permissions
			this.oAuthClient.resetUserPermissions(oauthUser.getId());
			if (isCreator) {
				this.oAuthClient.grantUserPermission(
					oauthUser.getId(),
					this.oauthAudience,
					String.format("account/%s", creator.getAccount().getUuid().toString()),
					PermissionLevel.admin
				);
			}
			if (isCustomer) {
				for (Customer customer : customers) {
					this.oAuthClient.grantUserPermission(
						oauthUser.getId(),
						customer.getShop().getOauthAudienceName(),
						String.format("customer/%s", customer.getId()),
						PermissionLevel.admin
					);
				}
			}

			// save user
			user.setOauthSubject(oauthUser.getSubject());
			user.setSyncState(SyncState.Synced);
		} catch (Exception e) {
			user.setSyncState(SyncState.Failed);
			log.error("Failed syncing user {}", user.getEmail(), e);
		} finally {
			this.usersService.save(user);
		}
	}

	public void syncUser(int userId) {
		this.syncUser(this.usersService.loadById(userId));
	}

	public void syncShop(Shop shop) {
		try {
			Audience audience = StringUtils.isBlank(shop.getOauthAudienceName())
				? new Audience()
				: this.oAuthClient.loadAudienceByName(shop.getOauthAudienceName());

			audience.setActive(shop.getState().isActive());
			audience.setName(shop.getSlug());
			audience.setTitle(shop.getName());
			audience = this.oAuthClient.saveAudience(audience);

			shop.setSyncState(SyncState.Synced);
			shop.setOauthAudienceName(audience.getName());
		} catch (Exception e) {
			shop.setSyncState(SyncState.Failed);
			log.error("Failed syncing shop {}", shop.getSlug(), e);
		} finally {
			this.shopsService.save(shop);
		}
	}

	public void syncShop(int shopId) {
		this.syncShop(this.shopsService.loadById(shopId));
	}
}
