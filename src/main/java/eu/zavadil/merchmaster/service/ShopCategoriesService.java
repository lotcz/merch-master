package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategory;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategoryRepository;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategoryStub;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategoryStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class ShopCategoriesService {

	@Autowired
	ShopCategoryStubRepository stubRepository;

	@Autowired
	ShopCategoryRepository repository;

	public Page<ShopCategory> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public ShopCategory loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public ShopCategoryStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public ShopCategory save(ShopCategory category) {
		return this.repository.save(category);
	}

	public ShopCategoryStub saveStub(ShopCategoryStub categoryStub) {
		return this.stubRepository.save(categoryStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(ShopCategoryStub categoryStub) {
		if (categoryStub.getId() != null) this.delete(categoryStub.getId());
	}

	public void delete(ShopCategory category) {
		if (category.getId() != null) this.delete(category.getId());
	}

	public Page<ShopCategory> searchByShopId(int shopId, String search, int page, int size, String sorting) {
		return this.repository.searchByShopId(shopId, search, PagingUtils.of(page, size, sorting));
	}

	public Page<ShopCategory> loadByShopId(int shopId, int page, int size, String sorting) {
		return this.repository.findAllByShopId(shopId, PagingUtils.of(page, size, sorting));
	}

}
