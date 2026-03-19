package eu.zavadil.merchmaster.data.shopProduct;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface ShopProductRepository extends EntityRepository<ShopProduct> {

	@Query(
		"""
				select sp
				from ShopProduct sp
				where sp.name ILIKE %:search%
			"""
	)
	Page<ShopProduct> search(String search, Pageable pr);

	@Query(
		"""
				select sp
				from ShopProduct sp
				where sp.shop.id = :shopId AND sp.name ILIKE %:search%
			"""
	)
	Page<ShopProduct> searchByShopId(int shopId, String search, Pageable pr);

	Page<ShopProduct> findAllByShopId(int shopId, Pageable pr);

}
