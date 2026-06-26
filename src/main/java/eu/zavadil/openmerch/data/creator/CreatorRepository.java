package eu.zavadil.openmerch.data.creator;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CreatorRepository extends EntityRepository<Creator> {

	@Query(
		"""
				select c
				from Creator c
				where c.user.name ILIKE %:search% OR c.user.email ILIKE %:search%
			"""
	)
	Page<Creator> search(String search, Pageable pr);

	List<Creator> findAllByAccountId(int accountId);

	Optional<Creator> findFirstByUserId(int userId);
}
