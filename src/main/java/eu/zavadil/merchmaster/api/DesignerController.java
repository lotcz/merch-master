package eu.zavadil.merchmaster.api;

import eu.zavadil.merchmaster.api.payload.DesignPayload;
import eu.zavadil.merchmaster.api.payload.PrintPreviewPayload;
import eu.zavadil.merchmaster.api.payload.PrintTypePayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.product.Product;
import eu.zavadil.merchmaster.data.product.ProductRepository;
import eu.zavadil.merchmaster.data.productColor.ProductColorStub;
import eu.zavadil.merchmaster.data.productColor.ProductColorStubRepository;
import eu.zavadil.merchmaster.service.DesignsService;
import eu.zavadil.merchmaster.service.PrintPreviewsService;
import eu.zavadil.merchmaster.service.PrintTypesService;
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
	public List<PrintPreviewStub> loadPreviews(@PathVariable int productId) {
		return this.previewStubRepository.findAllByProductId(productId);
	}

}
