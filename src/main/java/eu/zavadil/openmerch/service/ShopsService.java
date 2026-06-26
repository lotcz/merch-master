package eu.zavadil.openmerch.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.openmerch.data.SyncState;
import eu.zavadil.openmerch.data.shop.Shop;
import eu.zavadil.openmerch.data.shop.ShopRepository;
import eu.zavadil.openmerch.data.shop.ShopStub;
import eu.zavadil.openmerch.data.shop.ShopStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopsService {

	@Autowired
	ShopStubRepository stubRepository;

	@Autowired
	ShopRepository repository;

	public Page<Shop> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public Shop loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public ShopStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public Shop save(Shop shop) {
		return this.repository.save(shop);
	}

	public ShopStub saveStub(ShopStub shopStub) {
		return this.stubRepository.save(shopStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(ShopStub shopStub) {
		if (shopStub.getId() != null) this.delete(shopStub.getId());
	}

	public void delete(Shop shop) {
		if (shop.getId() != null) this.delete(shop.getId());
	}

	public List<Shop> loadAllByAccountId(int accountId) {
		return this.repository.findAllByAccountId(accountId);
	}

	public Page<Shop> loadSyncQueue() {
		return this.repository.findBySyncStateOrderByLastUpdatedOn(SyncState.Pending, PagingUtils.of(0, 10));
	}
}
