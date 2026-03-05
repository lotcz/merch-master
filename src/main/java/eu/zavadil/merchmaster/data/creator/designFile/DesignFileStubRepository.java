package eu.zavadil.merchmaster.data.creator.designFile;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

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
		if (fileIds == null || fileIds.isEmpty()) this.deleteAllByDesignId(designId);
		else this.deleteAllByDesignIdAndIdNotIn(designId, fileIds);
	}
}
