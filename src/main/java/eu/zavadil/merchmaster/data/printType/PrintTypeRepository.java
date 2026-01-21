package eu.zavadil.merchmaster.data.printType;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PrintTypeRepository extends EntityRepository<PrintType> {

	@Query("""
			select p
			from PrintZone p
			where p.name ILIKE %:search%
		""")
	Page<PrintType> search(String search, Pageable pr);

	Optional<PrintType> findFirstByName(String name);

}
