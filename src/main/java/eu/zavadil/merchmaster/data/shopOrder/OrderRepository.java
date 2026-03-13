package eu.zavadil.merchmaster.data.shopOrder;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends EntityRepository<Order> {

	@Query(
		"""
				select o
				from Order o
				where o.customer.user.name ILIKE %:search% OR o.customer.user.email ILIKE %:search%
			"""
	)
	Page<Order> search(String search, Pageable pr);

	Page<Order> findAllByCustomerId(int accountId, Pageable pr);

}
