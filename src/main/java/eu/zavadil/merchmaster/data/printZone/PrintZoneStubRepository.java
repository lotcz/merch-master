package eu.zavadil.merchmaster.data.printZone;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrintZoneStubRepository extends EntityRepository<PrintZoneStub> {

	@Query(
		"""
			select pz
			from PrintZoneStub pz
			where pz.id in (
				select ptz.printZoneId
				from PrintTypeZone ptz
				where ptz.printTypeId = :printTypeId
			)
			"""
	)
	List<PrintZoneStub> findAllByPrintTypeId(int printTypeId);

	List<PrintZoneStub> findAllByProductId(int productId);

}
