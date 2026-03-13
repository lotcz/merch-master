package eu.zavadil.merchmaster.data.user;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends EntityRepository<User> {

	@Query(
		"""
				select u
				from User u
				where u.name ILIKE %:search% OR u.email ILIKE %:search%
			"""
	)
	Page<User> search(String search, Pageable pr);
}
