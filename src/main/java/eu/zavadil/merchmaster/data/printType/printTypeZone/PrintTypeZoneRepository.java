package eu.zavadil.merchmaster.data.printType.printTypeZone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PrintTypeZoneRepository extends JpaRepository<PrintTypeZone, PrintTypeZoneId> {

	@Modifying
	@Transactional
	@Query(
		"""
			delete from PrintTypeZone ptz
			where ptz.printTypeId = :printTypeId
				and ptz.printZoneId not in :zoneIds
			"""
	)
	void deleteAllByPrintTypeIdAndIdNotIn(int printTypeId, List<Integer> zoneIds);

}
