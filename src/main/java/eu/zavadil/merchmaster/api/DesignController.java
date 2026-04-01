package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.api.payload.DesignPayload;
import eu.zavadil.merchmaster.data.design.Design;
import eu.zavadil.merchmaster.data.design.DesignRepository;
import eu.zavadil.merchmaster.data.design.DesignStubRepository;
import eu.zavadil.merchmaster.service.DesignsService;
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

	@Autowired
	DesignsService designsService;

	@GetMapping("")
	public JsonPage<Design> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.findAll(PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("{id}")
	public DesignPayload load(@PathVariable int id) {
		return this.designsService.loadPayload(id);
	}

	@PostMapping("")
	public DesignPayload insert(@RequestBody DesignPayload document) {
		document.getDesign().setId(null);
		document.getFiles().forEach(file -> file.setId(null));
		return this.designsService.savePayload(document);
	}

	@PutMapping("{id}")
	public DesignPayload update(@PathVariable int id, @RequestBody DesignPayload document) {
		document.getDesign().setId(id);
		return this.designsService.savePayload(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
