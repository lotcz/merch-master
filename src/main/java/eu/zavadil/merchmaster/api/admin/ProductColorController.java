package eu.zavadil.merchmaster.api.admin;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import eu.zavadil.merchmaster.data.admin.productColor.ProductColorStub;
import eu.zavadil.merchmaster.data.admin.productColor.ProductColorStubRepository;

@RestController
@RequestMapping("${api.base-url}/product-colors")
@Tag(name = "Product Colors")
@Slf4j
public class ProductColorController {

	@Autowired
	ProductColorStubRepository stubRepository;

	@GetMapping("by-product/{productId}")
	public List<ProductColorStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@PostMapping("")
	public ProductColorStub insert(@RequestBody ProductColorStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
	}

	@GetMapping("{id}")
	public ProductColorStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public ProductColorStub update(@PathVariable int id, @RequestBody ProductColorStub document) {
		document.setId(id);
		return this.stubRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}
}
