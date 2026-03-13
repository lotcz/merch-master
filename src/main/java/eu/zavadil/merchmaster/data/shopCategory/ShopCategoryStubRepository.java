package eu.zavadil.merchmaster.data.shopCategory;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface ShopCategoryStubRepository extends EntityRepository<ShopCategoryStub> {
	List<ShopCategoryStub> findAllByShopId(int shopId);
}
