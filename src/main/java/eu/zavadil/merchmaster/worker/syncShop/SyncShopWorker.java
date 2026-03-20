package eu.zavadil.merchmaster.worker.syncShop;

import eu.zavadil.java.queues.SmartQueueProcessorBase;
import eu.zavadil.merchmaster.data.shop.Shop;
import eu.zavadil.merchmaster.service.OAuthSyncService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SyncShopWorker extends SmartQueueProcessorBase<Shop> {

	@Autowired
	OAuthSyncService oAuthSyncService;

	@Autowired
	public SyncShopWorker(SyncShopQueue queue) {
		super(queue);
	}

	@Override
	public void processItem(Shop shop) {
		try {
			log.info("syncing shop {}", shop.getSlug());
			this.oAuthSyncService.syncShop(shop);
		} catch (Exception e) {
			log.error("Shop sync failed: {}", shop, e);
		}
	}
}
