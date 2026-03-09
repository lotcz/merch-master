package eu.zavadil.merchmaster.data.creator.imageCache;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ImageCacheStubRepository extends EntityRepository<ImageCacheStub> {
	List<ImageCacheStub> findAllByAccountId(int accountId);
}
