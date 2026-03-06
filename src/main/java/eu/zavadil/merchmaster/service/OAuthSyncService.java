package eu.zavadil.merchmaster.service;

import eu.zavadil.java.oauth.client.admin.OAuthAdminClient;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.SyncState;
import eu.zavadil.merchmaster.data.creator.shop.Shop;
import eu.zavadil.merchmaster.data.creator.shop.ShopRepository;
import eu.zavadil.merchmaster.data.creator.user.User;
import eu.zavadil.merchmaster.data.creator.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OAuthSyncService {

	@Autowired
	OAuthAdminClient oAuthClient;

	@Autowired
	UserRepository userRepository;

	@Autowired
	ShopRepository shopRepository;

	public void syncUser(User user) {
		eu.zavadil.java.oauth.client.admin.payload.User oauthUser = StringUtils.isBlank(user.getOauthSubject())
			? new eu.zavadil.java.oauth.client.admin.payload.User()
			: this.oAuthClient.loadUserBySubject(user.getOauthSubject());

		oauthUser.setActive(user.getState().isActive());
		oauthUser.setName(user.getName());
		oauthUser.setEmail(user.getEmail());
		oauthUser = this.oAuthClient.saveUser(oauthUser);

		user.setOauthSubject(oauthUser.getSubject());
		user.setSyncState(SyncState.Synced);
		this.userRepository.save(user);
	}

	public void syncUser(int userId) {
		this.syncUser(this.userRepository.findById(userId).orElseThrow());
	}

	public void syncShop(Shop shop) {
		eu.zavadil.java.oauth.client.admin.payload.Audience audience = StringUtils.isBlank(shop.getSlug())
			? new eu.zavadil.java.oauth.client.admin.payload.Audience()
			: this.oAuthClient.loadAudienceByName(shop.getSlug());

		audience.setActive(shop.getState().isActive());
		oauthUser.setName(user.getName());
		oauthUser.setEmail(user.getEmail());
		oauthUser = this.oAuthClient.saveUser(oauthUser);

		user.setOauthSubject(oauthUser.getSubject());
		user.setSyncState(SyncState.Synced);
		this.userRepository.save(user);
	}

	public void syncShop(int shopId) {
		this.syncShop(this.shopRepository.findById(shopId).orElseThrow());
	}
}
