package eu.zavadil.merchmaster.data.printPreview;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrintPreviewStubRepository extends EntityRepository<PrintPreviewStub> {

	List<PrintPreviewStub> findAllByProductId(int productId);

	@Query(
		"""
			select pp
			from PrintPreviewStub pp
			where pp.id in (
				select ptp.printPreviewId
				from PrintTypePreview ptp
				where ptp.printTypeId = :printTypeId
			)
			"""
	)
	List<PrintPreviewStub> findAllByPrintTypeId(int printTypeId);

}
