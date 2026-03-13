package eu.zavadil.merchmaster.data.creator;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.Optional;

public interface CreatorStubRepository extends EntityRepository<CreatorStub> {
	Optional<CreatorStub> findFirstByUserId(int userId);
}
