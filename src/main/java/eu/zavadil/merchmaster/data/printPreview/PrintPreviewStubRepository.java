package eu.zavadil.merchmaster.data.printPreview;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface PrintPreviewStubRepository extends EntityRepository<PrintPreviewStub> {

	List<PrintPreviewStub> findAllByProductId(int productId);

}
