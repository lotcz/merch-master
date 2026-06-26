package eu.zavadil.openmerch.data.shopCustomer;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.Optional;

public interface CustomerStubRepository extends EntityRepository<CustomerStub> {
	Optional<CustomerStub> findFirstByUserId(int userId);
}
