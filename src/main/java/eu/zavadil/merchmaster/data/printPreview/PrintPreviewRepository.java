package eu.zavadil.merchmaster.data.printPreview;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PrintPreviewRepository extends EntityRepository<PrintPreview> {

	@Query("""
			select p
			from PrintPreview p
			where p.name ILIKE %:search%
		""")
	Page<PrintPreview> search(String search, Pageable pr);

	Optional<PrintPreview> findFirstByName(String name);

}
