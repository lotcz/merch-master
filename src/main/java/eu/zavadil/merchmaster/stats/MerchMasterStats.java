package eu.zavadil.merchmaster.stats;

import eu.zavadil.java.JavaHeapStats;
import eu.zavadil.java.caching.HashCacheStats;
import eu.zavadil.java.queues.SmartQueueProcessorStats;
import lombok.Data;

@Data
public class MerchMasterStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();

}
