package eu.zavadil.merchmaster.data.shopProduct.shopCategory;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface ShopProductStubRepository extends EntityRepository<ShopProductStub> {
	List<ShopProductStub> findAllByShopId(int shopId);
}
