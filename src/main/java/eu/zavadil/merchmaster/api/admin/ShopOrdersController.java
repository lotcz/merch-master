package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.merchmaster.data.shopOrder.Order;
import eu.zavadil.merchmaster.data.shopOrder.OrderStub;
import eu.zavadil.merchmaster.data.shopOrderItem.OrderItemStub;
import eu.zavadil.merchmaster.service.ShopOrdersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/shop-orders")
@Tag(name = "Shop Orders")
@Slf4j
public class ShopOrdersController {

	@Autowired
	ShopOrdersService shopOrdersService;

	@GetMapping("")
	public JsonPage<Order> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.shopOrdersService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public OrderStub load(@PathVariable int id) {
		return this.shopOrdersService.loadStubById(id);
	}

	@PostMapping("")
	public OrderStub insert(@RequestBody OrderStub document) {
		document.setId(null);
		return this.shopOrdersService.saveStub(document);
	}

	@PutMapping("{id}")
	public OrderStub update(@PathVariable int id, @RequestBody OrderStub document) {
		document.setId(id);
		return this.shopOrdersService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.shopOrdersService.delete(id);
	}

	@GetMapping("{id}/items")
	public List<OrderItemStub> loadItems(@PathVariable int id) {
		return this.shopOrdersService.loadItems(id);
	}

	@PutMapping("{id}/items")
	public List<OrderItemStub> updateItems(@PathVariable int id, @RequestBody List<OrderItemStub> items) {

		return this.shopOrdersService.updateItems(id, items);
	}

	@GetMapping("by-shop/{shopId}")
	public JsonPage<Order> searchByShop(
		@PathVariable int shopId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			this.shopOrdersService.searchByShopId(shopId, search, page, size, sorting)
		);
	}

	@GetMapping("by-customer/{customerId}")
	public JsonPage<Order> loadByCustomer(
		@PathVariable int customerId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			this.shopOrdersService.loadByCustomerId(customerId, page, size, sorting)
		);
	}
}
