package eu.zavadil.merchmaster.data.productSize;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface ProductSizeStubRepository extends EntityRepository<ProductSizeStub> {
	List<ProductSizeStub> findAllByProductId(int productId);
}
