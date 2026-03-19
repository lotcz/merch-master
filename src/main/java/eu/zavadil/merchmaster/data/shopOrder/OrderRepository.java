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

	Page<Order> findAllByCustomerId(int customerId, Pageable pr);

	@Query(
		"""
				select o
				from Order o
				where o.customer.shop.id = :orderId
			"""
	)
	Page<Order> findAllByShopId(int orderId, Pageable pr);

	@Query(
		"""
				select o
				from Order o
				where o.customer.shop.id = :orderId AND o.customer.user.name ILIKE %:search% OR o.customer.user.email ILIKE %:search%
			"""
	)
	Page<Order> searchByShopId(int orderId, String search, Pageable pr);

}
