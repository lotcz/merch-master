package eu.zavadil.openmerch.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.openmerch.api.payload.DesignPayload;
import eu.zavadil.openmerch.data.design.Design;
import eu.zavadil.openmerch.data.design.DesignRepository;
import eu.zavadil.openmerch.data.design.DesignStubRepository;
import eu.zavadil.openmerch.service.DesignsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/designs")
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

	@GetMapping("{id}/full")
	public Design loadFull(@PathVariable int id) {
		return this.designsService.loadFull(id);
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

	@GetMapping("by-account/{accountId}")
	public JsonPage<Design> searchByAccount(
		@PathVariable int accountId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			StringUtils.isBlank(search) ? this.designsService.loadByAccount(accountId, page, size, sorting)
				: this.designsService.searchByAccount(accountId, search, page, size, sorting)
		);
	}
}
