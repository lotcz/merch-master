package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.designFile.DesignFile;
import eu.zavadil.merchmaster.data.designFile.DesignFileRepository;
import eu.zavadil.merchmaster.data.designFile.DesignFileStub;
import eu.zavadil.merchmaster.data.designFile.DesignFileStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/design-files")
@Tag(name = "Design Files")
@Slf4j
public class DesignFileController {

	@Autowired
	DesignFileRepository repository;

	@Autowired
	DesignFileStubRepository stubRepository;

	@GetMapping("")
	public JsonPage<DesignFile> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.findAll(PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public DesignFileStub insert(@RequestBody DesignFileStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
	}

	@GetMapping("{id}")
	public DesignFileStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public DesignFileStub update(@PathVariable int id, @RequestBody DesignFileStub document) {
		document.setId(id);
		return this.stubRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
