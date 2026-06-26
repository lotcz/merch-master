package eu.zavadil.openmerch.data.account;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface AccountRepository extends EntityRepository<Account> {
	@Query(
		"""
				select a
				from Account a
				where a.name ILIKE %:search%
			"""
	)
	Page<Account> search(String search, Pageable pr);
}
