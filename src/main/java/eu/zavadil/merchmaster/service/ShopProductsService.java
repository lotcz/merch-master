package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.shopProduct.shopCategory.ShopProduct;
import eu.zavadil.merchmaster.data.shopProduct.shopCategory.ShopProductRepository;
import eu.zavadil.merchmaster.data.shopProduct.shopCategory.ShopProductStub;
import eu.zavadil.merchmaster.data.shopProduct.shopCategory.ShopProductStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ShopProductsService {

	@Autowired
	ShopProductStubRepository stubRepository;

	@Autowired
	ShopProductRepository repository;

	public Page<ShopProduct> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public ShopProduct loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public ShopProductStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public ShopProduct save(ShopProduct customer) {
		return this.repository.save(customer);
	}

	public ShopProductStub saveStub(ShopProductStub shopProductStub) {
		return this.stubRepository.save(shopProductStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(ShopProductStub shopProductStub) {
		if (shopProductStub.getId() != null) this.delete(shopProductStub.getId());
	}

	public void delete(ShopProduct shopProduct) {
		if (shopProduct.getId() != null) this.delete(shopProduct.getId());
	}

	public Page<ShopProduct> searchByShopId(int shopId, String search, int page, int size, String sorting) {
		return this.repository.searchByShopId(shopId, search, PagingUtils.of(page, size, sorting));
	}

	public Page<ShopProduct> loadByShopId(int shopId, int page, int size, String sorting) {
		return this.repository.findAllByShopId(shopId, PagingUtils.of(page, size, sorting));
	}

}
