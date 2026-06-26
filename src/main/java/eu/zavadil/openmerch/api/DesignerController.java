package eu.zavadil.openmerch.api;

import eu.zavadil.openmerch.api.payload.DesignPayload;
import eu.zavadil.openmerch.api.payload.PrintPreviewPayload;
import eu.zavadil.openmerch.api.payload.PrintTypePayload;
import eu.zavadil.openmerch.data.printPreview.PrintPreviewStub;
import eu.zavadil.openmerch.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.openmerch.data.printType.PrintTypeStub;
import eu.zavadil.openmerch.data.printType.PrintTypeStubRepository;
import eu.zavadil.openmerch.data.product.Product;
import eu.zavadil.openmerch.data.product.ProductRepository;
import eu.zavadil.openmerch.data.productColor.ProductColorStub;
import eu.zavadil.openmerch.data.productColor.ProductColorStubRepository;
import eu.zavadil.openmerch.service.DesignsService;
import eu.zavadil.openmerch.service.PrintPreviewsService;
import eu.zavadil.openmerch.service.PrintTypesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${api.base-url}/designer")
@Tag(name = "Designer", description = "Endpoints used by designer. All freely accessible.")
@Slf4j
public class DesignerController {

	/* PRODUCTS */

	@Autowired
	ProductRepository productRepository;

	@GetMapping("products")
	public List<Product> loadProducts() {
		return this.productRepository.findAll();
	}

	@GetMapping("product/{id}")
	public Product loadProduct(@PathVariable int id) {
		return this.productRepository.findById(id).orElseThrow();
	}

	/* COLORS */

	@Autowired
	ProductColorStubRepository productColorStubRepository;

	@GetMapping("product-colors/by-product/{productId}")
	public List<ProductColorStub> loadColorsByProduct(@PathVariable int productId) {
		return this.productColorStubRepository.findAllByProductId(productId);
	}

	/* PRINT TYPES */

	@Autowired
	PrintTypeStubRepository printTypeStubRepository;

	@Autowired
	PrintTypesService printTypesService;

	@GetMapping("print-types/by-product/{productId}")
	public List<PrintTypeStub> loadPrintTypesByProduct(@PathVariable int productId) {
		return this.printTypeStubRepository.findAllByProductId(productId);
	}

	@GetMapping("print-types/{printTypeId}")
	public PrintTypePayload loadPrintType(@PathVariable int printTypeId) {
		return this.printTypesService.load(printTypeId);
	}

	/* DESIGNS */

	@Autowired
	DesignsService designsService;

	@GetMapping("designs/{uuid}")
	public DesignPayload loadDesign(@PathVariable UUID uuid) {
		return this.designsService.loadPayload(uuid);
	}

	@RequestMapping(path = "designs", method = {RequestMethod.POST, RequestMethod.PUT})
	public DesignPayload saveDesign(@RequestBody DesignPayload document) {
		return this.designsService.savePayload(document);
	}

	/* PREVIEW */

	@Autowired
	PrintPreviewsService previewsService;

	@Autowired
	PrintPreviewStubRepository previewStubRepository;

	@GetMapping("previews/{id}")
	public PrintPreviewPayload loadPreview(@PathVariable int id) {
		return this.previewsService.load(id);
	}

	@GetMapping("previews/by-product/{productId}")
	public List<PrintPreviewPayload> loadPreviews(@PathVariable int productId) {
		List<PrintPreviewStub> stubs = this.previewStubRepository.findAllByProductId(productId);
		return stubs
			.stream()
			.map(s -> this.previewsService.load(s))
			.toList();
	}
}
