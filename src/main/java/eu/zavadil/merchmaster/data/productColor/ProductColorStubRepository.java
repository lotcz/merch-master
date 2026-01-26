package eu.zavadil.merchmaster.data.productColor;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface ProductColorStubRepository extends EntityRepository<ProductColorStub> {

	List<ProductColorStub> findAllByProductId(int productId);

}
