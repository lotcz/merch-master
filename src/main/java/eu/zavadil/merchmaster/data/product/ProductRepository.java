package eu.zavadil.merchmaster.data.product;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProductRepository extends EntityRepository<Product> {

	@Query("""
			select p
			from Product p
			where p.name ILIKE %:search%
		""")
	Page<Product> search(String search, Pageable pr);

	Optional<Product> findFirstByName(String name);

}
