package eu.zavadil.merchmaster.data.printZone;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PrintZoneRepository extends EntityRepository<PrintZone> {

	@Query("""
			select p
			from PrintPreview p
			where p.name ILIKE %:search%
		""")
	Page<PrintZone> search(String search, Pageable pr);

	Optional<PrintZone> findFirstByName(String name);

}
