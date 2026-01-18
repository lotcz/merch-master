package eu.zavadil.merchmaster.stats;

import org.springframework.stereotype.Service;

@Service
public class StatsService {

	public MerchMasterStats getStats() {
		final MerchMasterStats stats = new MerchMasterStats();

		return stats;
	}
}
