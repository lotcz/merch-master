package eu.zavadil.merchmaster.worker.syncShop;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.merchmaster.data.shop.Shop;
import eu.zavadil.merchmaster.service.ShopsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class SyncShopQueue extends PagedSmartQueue<Shop> {

	@Autowired
	ShopsService shopsService;

	@Override
	public Page<Shop> loadRemaining() {
		return this.shopsService.loadSyncQueue();
	}

}
