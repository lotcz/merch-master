package eu.zavadil.merchmaster.data.design;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.Optional;
import java.util.UUID;

public interface DesignStubRepository extends EntityRepository<DesignStub> {

	Optional<DesignStub> findByUuid(UUID uuid);
}
