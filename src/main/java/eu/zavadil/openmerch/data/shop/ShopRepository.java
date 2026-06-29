package eu.zavadil.openmerch.data.shop;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import eu.zavadil.openmerch.data.SyncState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShopRepository extends EntityRepository<Shop> {

	@Query(
		"""
				select s
				from Shop s
				where s.name ILIKE %:search%
			"""
	)
	Page<Shop> search(String search, Pageable pr);

	List<Shop> findAllByAccountId(int accountId);

}
