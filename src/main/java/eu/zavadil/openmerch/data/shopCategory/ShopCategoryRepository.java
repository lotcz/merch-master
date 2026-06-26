package eu.zavadil.openmerch.data.shopCategory;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface ShopCategoryRepository extends EntityRepository<ShopCategory> {

	@Query(
		"""
				select c
				from ShopCategory c
				where c.name ILIKE %:search%
			"""
	)
	Page<ShopCategory> search(String search, Pageable pr);

	@Query(
		"""
				select c
				from ShopCategory c
				where c.shop.id = :shopId AND c.name ILIKE %:search%
			"""
	)
	Page<ShopCategory> searchByShopId(int shopId, String search, Pageable pr);

	Page<ShopCategory> findAllByShopId(int shopId, Pageable pr);

}
