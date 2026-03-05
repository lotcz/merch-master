package eu.zavadil.merchmaster.data.admin.printType.printTypePreview;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface PrintTypePreviewRepository extends JpaRepository<PrintTypePreview, PrintTypePreviewId> {
	@Modifying
	@Transactional
	@Query(
		"""
		delete from PrintTypePreview ptp
		where ptp.printTypeId = :printTypeId
			and ptp.printPreviewId not in :previewIds
		"""
	)
	void deleteAllByPrintTypeIdAndIdNotIn(int printTypeId, List<Integer> previewIds);
}
