package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.merchmaster.data.creator.shop.Shop;
import eu.zavadil.merchmaster.data.creator.shop.ShopStub;
import eu.zavadil.merchmaster.service.ShopsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/shops")
@Tag(name = "Shops")
@Slf4j
public class ShopsController {

	@Autowired
	ShopsService shopsService;

	@GetMapping("")
	public JsonPage<Shop> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.shopsService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public ShopStub load(@PathVariable int id) {
		return this.shopsService.loadStubById(id);
	}

	@PostMapping("")
	public ShopStub insert(@RequestBody ShopStub document) {
		document.setId(null);
		return this.shopsService.saveStub(document);
	}

	@PutMapping("{id}")
	public ShopStub update(@PathVariable int id, @RequestBody ShopStub document) {
		document.setId(id);
		return this.shopsService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.shopsService.delete(id);
	}

	@GetMapping("by-account/{accountId}")
	public List<Shop> loadAllByAccount(@PathVariable int accountId) {
		return this.shopsService.loadAllByAccountId(accountId);
	}
}
