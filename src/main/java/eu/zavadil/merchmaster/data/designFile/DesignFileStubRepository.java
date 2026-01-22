package eu.zavadil.merchmaster.data.designFile;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface DesignFileStubRepository extends EntityRepository<DesignFileStub> {

	List<DesignFileStub> findAllByDesignId(int designId);

	@Modifying
	void deleteAllByDesignIdAndIdNotIn(int designId, List<Integer> previewIds);

}
