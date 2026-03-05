package eu.zavadil.merchmaster.data.admin.printType;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import java.util.List;

public interface PrintTypeStubRepository extends EntityRepository<PrintTypeStub> {
	List<PrintTypeStub> findAllByProductId(int productId);
}
