package eu.zavadil.openmerch.data.design;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface DesignRepository extends EntityRepository<Design> {

	@Query(
		"""
				select d
				from Design d
				where d.account.id = :accountId
			"""
	)
	Page<Design> loadByAccount(int accountId, Pageable pr);

	@Query(
		"""
				select d
				from Design d
				where d.account.id = :accountId and (
							d.description ILIKE %:search%
							or d.productColor.name ILIKE %:search%
							or d.productColor.product.name ILIKE %:search%
						)
			"""
	)
	Page<Design> searchByAccount(int accountId, String search, Pageable pr);

}
