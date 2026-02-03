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

	@Modifying
	@Transactional
	void deleteAllByPrintPreviewId(int printPreviewId);

	@Modifying
	@Transactional
	default void cleanOtherPreviews(int designId, List<Integer> previewZoneIds) {
		if (previewZoneIds == null || previewZoneIds.isEmpty())
			this.deleteAllByPrintPreviewId(designId);
		else
			this.deleteAllByPrintPreviewIdAndIdNotIn(designId, previewZoneIds);
	}
}
