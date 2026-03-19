package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.shopOrder.Order;
import eu.zavadil.merchmaster.data.shopOrder.OrderRepository;
import eu.zavadil.merchmaster.data.shopOrder.OrderStub;
import eu.zavadil.merchmaster.data.shopOrder.OrderStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ShopOrdersService {

	@Autowired
	OrderStubRepository stubRepository;

	@Autowired
	OrderRepository repository;

	public Page<Order> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public Order loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public OrderStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public Order save(Order customer) {
		return this.repository.save(customer);
	}

	public OrderStub saveStub(OrderStub shopOrderStub) {
		return this.stubRepository.save(shopOrderStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(OrderStub shopOrderStub) {
		if (shopOrderStub.getId() != null) this.delete(shopOrderStub.getId());
	}

	public void delete(Order shopOrder) {
		if (shopOrder.getId() != null) this.delete(shopOrder.getId());
	}

	public Page<Order> loadByCustomerId(int shopId, int page, int size, String sorting) {
		return this.repository.findAllByCustomerId(shopId, PagingUtils.of(page, size, sorting));
	}

	public Page<Order> loadByShopId(int shopId, int page, int size, String sorting) {
		return this.repository.findAllByShopId(shopId, PagingUtils.of(page, size, sorting));
	}

	public Page<Order> searchByShopId(int shopId, String search, int page, int size, String sorting) {
		return StringUtils.isBlank(search) ? this.loadByShopId(shopId, page, size, sorting)
			: this.repository.searchByShopId(shopId, search, PagingUtils.of(page, size, sorting));
	}
}

