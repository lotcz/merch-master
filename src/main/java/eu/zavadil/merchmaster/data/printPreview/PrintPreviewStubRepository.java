package eu.zavadil.merchmaster.data.printPreview;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PrintPreviewStubRepository extends EntityRepository<PrintPreviewStub> {

	List<PrintPreviewStub> findAllByPrintZoneId(int printZoneId);

	@Modifying
	@Transactional
	void deleteAllByPrintZoneIdAndIdNotIn(int printZoneId, List<Integer> previewIds);

}
