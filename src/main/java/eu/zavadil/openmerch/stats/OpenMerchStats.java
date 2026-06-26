package eu.zavadil.openmerch.stats;

import eu.zavadil.java.JavaHeapStats;
import lombok.Data;

@Data
public class OpenMerchStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();
}
