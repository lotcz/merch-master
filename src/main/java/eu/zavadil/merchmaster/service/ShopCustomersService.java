package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.shopCustomer.Customer;
import eu.zavadil.merchmaster.data.shopCustomer.CustomerRepository;
import eu.zavadil.merchmaster.data.shopCustomer.CustomerStub;
import eu.zavadil.merchmaster.data.shopCustomer.CustomerStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopCustomersService {

	@Autowired
	CustomerStubRepository stubRepository;

	@Autowired
	CustomerRepository repository;

	public Page<Customer> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public Customer loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public CustomerStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public Customer save(Customer customer) {
		return this.repository.save(customer);
	}

	public CustomerStub saveStub(CustomerStub customerStub) {
		return this.stubRepository.save(customerStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(CustomerStub customerStub) {
		if (customerStub.getId() != null) this.delete(customerStub.getId());
	}

	public void delete(Customer customer) {
		if (customer.getId() != null) this.delete(customer.getId());
	}

	public Page<Customer> searchByShopId(int shopId, String search, int page, int size, String sorting) {
		return this.repository.searchByShopId(shopId, search, PagingUtils.of(page, size, sorting));
	}

	public Page<Customer> loadByShopId(int shopId, int page, int size, String sorting) {
		return this.repository.findAllByShopId(shopId, PagingUtils.of(page, size, sorting));
	}

	List<Customer> loadByUserId(int userId) {
		return this.repository.findAllByUserId(userId);
	}

}
