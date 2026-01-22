package eu.zavadil.merchmaster.data.printZone;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface PrintZoneStubRepository extends EntityRepository<PrintZoneStub> {

	List<PrintZoneStub> findAllByPrintTypeId(int printTypeId);

	@Modifying
	void deleteAllByPrintTypeIdAndIdNotIn(int printTypeId, List<Integer> zoneIds);

}
