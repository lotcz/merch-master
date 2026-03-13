package eu.zavadil.merchmaster.service;

import eu.zavadil.java.oauth.client.admin.OAuthAdminClient;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.SyncState;
import eu.zavadil.merchmaster.data.creator.Creator;
import eu.zavadil.merchmaster.data.shop.Shop;
import eu.zavadil.merchmaster.data.shopCustomer.Customer;
import eu.zavadil.merchmaster.data.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OAuthSyncService {

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
		eu.zavadil.java.oauth.client.admin.payload.User oauthUser = StringUtils.isBlank(user.getOauthSubject())
			? new eu.zavadil.java.oauth.client.admin.payload.User()
			: this.oAuthClient.loadUserBySubject(user.getOauthSubject());

		Creator creator = this.creatorsService.loadByUserId(user.getId());
		List<Customer> customers = this.customersService.loadByUserId(user.getId());

		boolean isCreator = creator != null && creator.getUserState().isActive();
		boolean isCustomer = customers.stream().anyMatch(c -> c.getUserState().isActive());

		oauthUser.setActive(isCreator || isCustomer);
		oauthUser.setName(user.getName());
		oauthUser.setEmail(user.getEmail());
		oauthUser = this.oAuthClient.saveUser(oauthUser);

		//todo: sync permissions

		user.setOauthSubject(oauthUser.getSubject());
		user.setSyncState(SyncState.Synced);
		this.usersService.save(user);
	}

	public void syncUser(int userId) {
		this.syncUser(this.usersService.loadById(userId));
	}

	public void syncShop(Shop shop) {
		eu.zavadil.java.oauth.client.admin.payload.Audience audience = StringUtils.isBlank(shop.getSlug())
			? new eu.zavadil.java.oauth.client.admin.payload.Audience()
			: this.oAuthClient.loadAudienceByName(shop.getSlug());

		audience.setActive(shop.getState().isActive());
		audience.setName(shop.getSlug());
		audience.setTitle(shop.getName());
		audience = this.oAuthClient.saveAudience(audience);

		shop.setSyncState(SyncState.Synced);
		this.shopsService.save(shop);
	}

	public void syncShop(int shopId) {
		this.syncShop(this.shopsService.loadById(shopId));
	}
}
