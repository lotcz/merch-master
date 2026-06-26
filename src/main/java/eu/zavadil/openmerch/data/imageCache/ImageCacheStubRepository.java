package eu.zavadil.openmerch.data.imageCache;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;
import java.util.Optional;

public interface ImageCacheStubRepository extends EntityRepository<ImageCacheStub> {

	List<ImageCacheStub> findAllByAccountId(int accountId);

	Optional<ImageCacheStub> findFirstByImageNameAndAccountId(String imageName, int accountId);
}
