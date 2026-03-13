package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.shopCustomer.Customer;
import eu.zavadil.merchmaster.data.shopCustomer.CustomerStub;
import eu.zavadil.merchmaster.service.CustomersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/customers")
@Tag(name = "Customers")
@Slf4j
public class CustomersController {

	@Autowired
	CustomersService customersService;

	@GetMapping("")
	public JsonPage<Customer> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.customersService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public CustomerStub load(@PathVariable int id) {
		return this.customersService.loadStubById(id);
	}

	@PostMapping("")
	public CustomerStub insert(@RequestBody CustomerStub document) {
		document.setId(null);
		return this.customersService.saveStub(document);
	}

	@PutMapping("{id}")
	public CustomerStub update(@PathVariable int id, @RequestBody CustomerStub document) {
		document.setId(id);
		return this.customersService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.customersService.delete(id);
	}

	@GetMapping("by-shop/{shopId}")
	public JsonPage<Customer> searchByShop(
		@PathVariable int shopId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			StringUtils.isBlank(search) ? this.customersService.loadByShopId(shopId, page, size, sorting)
				: this.customersService.searchByShopId(shopId, search, page, size, sorting)
		);
	}
}
