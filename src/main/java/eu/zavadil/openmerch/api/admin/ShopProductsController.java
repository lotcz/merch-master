package eu.zavadil.openmerch.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openmerch.data.shopProduct.ShopProduct;
import eu.zavadil.openmerch.data.shopProduct.ShopProductStub;
import eu.zavadil.openmerch.service.ShopProductsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/shop-products")
@Tag(name = "Shop Products")
@Slf4j
public class ShopProductsController {

	@Autowired
	ShopProductsService shopProductsService;

	@GetMapping("")
	public JsonPage<ShopProduct> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.shopProductsService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public ShopProductStub load(@PathVariable int id) {
		return this.shopProductsService.loadStubById(id);
	}

	@GetMapping("{id}/full")
	public ShopProduct loadFull(@PathVariable int id) {
		return this.shopProductsService.loadById(id);
	}

	@PostMapping("")
	public ShopProductStub insert(@RequestBody ShopProductStub document) {
		document.setId(null);
		return this.shopProductsService.saveStub(document);
	}

	@PutMapping("{id}")
	public ShopProductStub update(@PathVariable int id, @RequestBody ShopProductStub document) {
		document.setId(id);
		return this.shopProductsService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.shopProductsService.delete(id);
	}

	@GetMapping("by-shop/{shopId}")
	public JsonPage<ShopProduct> searchByShop(
		@PathVariable int shopId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			StringUtils.isBlank(search) ? this.shopProductsService.loadByShopId(shopId, page, size, sorting)
				: this.shopProductsService.searchByShopId(shopId, search, page, size, sorting)
		);
	}
}
