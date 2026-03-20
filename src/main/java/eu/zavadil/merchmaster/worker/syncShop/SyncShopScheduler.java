package eu.zavadil.merchmaster.worker.syncShop;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SyncShopScheduler {

	@Autowired
	SyncShopWorker worker;

	@Scheduled(fixedDelay = 5 * 1000, initialDelay = 3 * 1000)
	public void execute() {
		log.info("syncing shops");
		this.worker.process();
	}

}
