package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.design.Design;
import eu.zavadil.merchmaster.data.design.DesignRepository;
import eu.zavadil.merchmaster.data.design.DesignStub;
import eu.zavadil.merchmaster.data.design.DesignStubRepository;
import eu.zavadil.merchmaster.data.printPreview.PrintPreview;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewRepository;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/designs")
@Tag(name = "Designs")
@Slf4j
public class DesignController {

	@Autowired
	DesignRepository repository;

	@Autowired
	DesignStubRepository stubRepository;

	@GetMapping("")
	public JsonPage<Design> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.findAll(PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public DesignStub insert(@RequestBody DesignStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
	}

	@GetMapping("{id}")
	public DesignStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public DesignStub update(@PathVariable int id, @RequestBody DesignStub document) {
		document.setId(id);
		return this.stubRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
