package eu.zavadil.openmerch.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openmerch.data.creator.Creator;
import eu.zavadil.openmerch.data.creator.CreatorStub;
import eu.zavadil.openmerch.service.CreatorsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/creators")
@Tag(name = "Creators")
@Slf4j
public class CreatorsController {

	@Autowired
	CreatorsService creatorsService;

	@GetMapping("")
	public JsonPage<Creator> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.creatorsService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public CreatorStub load(@PathVariable int id) {
		return this.creatorsService.loadStubById(id);
	}

	@PostMapping("")
	public CreatorStub insert(@RequestBody CreatorStub document) {
		document.setId(null);
		return this.creatorsService.saveStub(document);
	}

	@PutMapping("{id}")
	public CreatorStub update(@PathVariable int id, @RequestBody CreatorStub document) {
		document.setId(id);
		return this.creatorsService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.creatorsService.delete(id);
	}

	@GetMapping("by-account/{accountId}")
	public List<Creator> loadAllByAccount(@PathVariable int accountId) {
		return this.creatorsService.loadAllByAccountId(accountId);
	}
}
