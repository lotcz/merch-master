package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.merchmaster.data.productSize.ProductSizeStub;
import eu.zavadil.merchmaster.data.productSize.ProductSizeStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/product-sizes")
@Tag(name = "Product Sizes")
@Slf4j
public class ProductSizeController {

	@Autowired
	ProductSizeStubRepository stubRepository;

	@GetMapping("by-product/{productId}")
	public List<ProductSizeStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@PostMapping("")
	public ProductSizeStub insert(@RequestBody ProductSizeStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
	}

	@GetMapping("{id}")
	public ProductSizeStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public ProductSizeStub update(@PathVariable int id, @RequestBody ProductSizeStub document) {
		document.setId(id);
		return this.stubRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}
}
