package eu.zavadil.merchmaster.data.printPreviewZone;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PrintPreviewZoneRepository extends EntityRepository<PrintPreviewZone> {

	@Query("""
			select p
			from PrintPreviewZone p
			where p.name ILIKE %:search%
		""")
	Page<PrintPreviewZone> search(String search, Pageable pr);

	Optional<PrintPreviewZone> findFirstByName(String name);

}
