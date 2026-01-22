package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.printPreview.PrintPreview;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewRepository;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZone;
import eu.zavadil.merchmaster.data.printZone.PrintZoneRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/print-previews")
@Tag(name = "Print Previews")
@Slf4j
public class PrintPreviewController {

	@Autowired
	PrintPreviewRepository repository;

	@Autowired
	PrintPreviewStubRepository stubRepository;

	@GetMapping("")
	public JsonPage<PrintPreview> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public PrintPreviewStub insert(@RequestBody PrintPreviewStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
	}

	@GetMapping("{id}")
	public PrintPreviewStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public PrintPreviewStub update(@PathVariable int id, @RequestBody PrintPreviewStub document) {
		document.setId(id);
		return this.stubRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
