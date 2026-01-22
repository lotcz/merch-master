package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.printType.PrintType;
import eu.zavadil.merchmaster.data.printType.PrintTypeRepository;
import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZone;
import eu.zavadil.merchmaster.data.printZone.PrintZoneRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/print-zones")
@Tag(name = "Print Zones")
@Slf4j
public class PrintZoneController {

	@Autowired
	PrintZoneRepository repository;

	@Autowired
	PrintZoneStubRepository stubRepository;

	@GetMapping("")
	public JsonPage<PrintZone> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public PrintZoneStub insert(@RequestBody PrintZoneStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
	}

	@GetMapping("{id}")
	public PrintZoneStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PutMapping("{id}")
	public PrintZoneStub update(@PathVariable int id, @RequestBody PrintZoneStub document) {
		document.setId(id);
		return this.stubRepository.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
