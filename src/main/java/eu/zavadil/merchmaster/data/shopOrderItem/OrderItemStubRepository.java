package eu.zavadil.merchmaster.data.shopOrderItem;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderItemStubRepository extends EntityRepository<OrderItemStub> {

	List<OrderItemStub> findAllByOrderId(int orderId);


	@Modifying
	@Transactional
	void deleteAllByOrderIdAndIdNotIn(int orderId, List<Integer> itemIds);

	@Modifying
	@Transactional
	void deleteAllByOrderId(int orderId);

	@Modifying
	@Transactional
	default void cleanOtherItems(int orderId, List<Integer> itemIds) {
		if (itemIds == null || itemIds.isEmpty()) this.deleteAllByOrderId(orderId);
		else this.deleteAllByOrderIdAndIdNotIn(orderId, itemIds);
	}
}
