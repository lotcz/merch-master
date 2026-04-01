package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.product.Product;
import eu.zavadil.merchmaster.data.product.ProductRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/products")
@Tag(name = "Products")
@Slf4j
public class ProductController {

	@Autowired
	ProductRepository productRepository;

	@GetMapping("")
	public JsonPage<Product> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.productRepository.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Product insert(@RequestBody Product document) {
		document.setId(null);
		return this.productRepository.save(document);
	}

	@GetMapping("{id}")
	public Product load(@PathVariable int id) {
		return this.productRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public Product update(@PathVariable int id, @RequestBody Product document) {
		document.setId(id);
		return this.productRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.productRepository.deleteById(id);
	}

}
