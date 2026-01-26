package eu.zavadil.merchmaster.data.printZone;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PrintZoneStubRepository extends EntityRepository<PrintZoneStub> {

	List<PrintZoneStub> findAllByPrintTypeId(int printTypeId);

	@Modifying
	@Transactional
	void deleteAllByPrintTypeIdAndIdNotIn(int printTypeId, List<Integer> zoneIds);

}
