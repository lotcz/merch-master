package eu.zavadil.openmerch.stats;

import org.springframework.stereotype.Service;

@Service
public class StatsService {

	public OpenMerchStats getStats() {
		return new OpenMerchStats();
	}
}
