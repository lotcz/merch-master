package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategory;
import eu.zavadil.merchmaster.data.shopCategory.ShopCategoryStub;
import eu.zavadil.merchmaster.service.ShopCategoriesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/shop-categories")
@Tag(name = "Shop Categories")
@Slf4j
public class ShopCategoriesController {

	@Autowired
	ShopCategoriesService shopCategoriesService;

	@GetMapping("")
	public JsonPage<ShopCategory> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.shopCategoriesService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public ShopCategoryStub load(@PathVariable int id) {
		return this.shopCategoriesService.loadStubById(id);
	}

	@PostMapping("")
	public ShopCategoryStub insert(@RequestBody ShopCategoryStub document) {
		document.setId(null);
		return this.shopCategoriesService.saveStub(document);
	}

	@PutMapping("{id}")
	public ShopCategoryStub update(@PathVariable int id, @RequestBody ShopCategoryStub document) {
		document.setId(id);
		return this.shopCategoriesService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.shopCategoriesService.delete(id);
	}

	@GetMapping("by-shop/{shopId}")
	public JsonPage<ShopCategory> searchByShop(
		@PathVariable int shopId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			StringUtils.isBlank(search) ? this.shopCategoriesService.loadByShopId(shopId, page, size, sorting)
				: this.shopCategoriesService.searchByShopId(shopId, search, page, size, sorting)
		);
	}
}
