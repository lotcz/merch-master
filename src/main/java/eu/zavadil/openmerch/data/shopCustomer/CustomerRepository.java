package eu.zavadil.openmerch.data.shopCustomer;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository extends EntityRepository<Customer> {

	@Query(
		"""
				select c
				from Customer c
				where c.user.name ILIKE %:search% OR c.user.email ILIKE %:search%
			"""
	)
	Page<Customer> search(String search, Pageable pr);

	@Query(
		"""
				select c
				from Customer c
				where c.shop.id = :shopId AND c.user.name ILIKE %:search% OR c.user.email ILIKE %:search%
			"""
	)
	Page<Customer> searchByShopId(int shopId, String search, Pageable pr);

	Page<Customer> findAllByShopId(int shopId, Pageable pr);

	List<Customer> findAllByUserId(int userId);
}
