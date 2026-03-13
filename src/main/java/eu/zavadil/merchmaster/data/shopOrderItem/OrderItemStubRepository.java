package eu.zavadil.merchmaster.data.shopOrderItem;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface OrderItemStubRepository extends EntityRepository<OrderItemStub> {
	List<OrderItemStub> findAllByOrderId(int orderId);
}
