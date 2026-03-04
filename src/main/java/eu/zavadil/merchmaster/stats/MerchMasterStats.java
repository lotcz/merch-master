package eu.zavadil.merchmaster.stats;

import eu.zavadil.java.JavaHeapStats;
import lombok.Data;

@Data
public class MerchMasterStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();
}
