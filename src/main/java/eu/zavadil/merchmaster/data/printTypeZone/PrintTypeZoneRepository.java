package eu.zavadil.merchmaster.data.printTypeZone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PrintTypeZoneRepository extends JpaRepository<PrintTypeZone, PrintTypeZoneId> {

	@Query(
		"""
				select ptz.printZoneId
				from PrintTypeZone ptz
				where ptz.printTypeId = :printTypeId
			"""
	)
	List<Integer> findAllZoneIdsByPrintTypeId(int printTypeId);

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
