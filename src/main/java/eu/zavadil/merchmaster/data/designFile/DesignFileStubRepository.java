package eu.zavadil.merchmaster.data.designFile;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DesignFileStubRepository extends EntityRepository<DesignFileStub> {

	List<DesignFileStub> findAllByDesignId(int designId);

	@Modifying
	@Transactional
	void deleteAllByDesignIdAndIdNotIn(int designId, List<Integer> fileIds);

	@Modifying
	@Transactional
	void deleteAllByDesignId(int designId);

	@Modifying
	@Transactional
	default void cleanOtherFiles(int designId, List<Integer> fileIds) {
		if (fileIds == null || fileIds.isEmpty())
			this.deleteAllByDesignId(designId);
		else
			this.deleteAllByDesignIdAndIdNotIn(designId, fileIds);
	}
}
