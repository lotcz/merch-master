package eu.zavadil.merchmaster.data.printPreviewZone;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PrintPreviewZoneStubRepository extends EntityRepository<PrintPreviewZoneStub> {

	List<PrintPreviewZoneStub> findAllByPrintPreviewId(int printPreviewId);

	@Modifying
	@Transactional
	void deleteAllByPrintPreviewIdAndIdNotIn(int printPreviewId, List<Integer> previewZoneIds);

}
