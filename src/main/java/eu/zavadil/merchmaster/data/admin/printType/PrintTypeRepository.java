package eu.zavadil.merchmaster.data.admin.printType;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface PrintTypeRepository extends EntityRepository<PrintType> {
	@Query(
		"""
			select p
			from PrintZone p
			where p.name ILIKE %:search%
		"""
	)
	Page<PrintType> search(String search, Pageable pr);

	Optional<PrintType> findFirstByName(String name);
}
