package eu.zavadil.merchmaster.api;

import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/print-zones")
@Tag(name = "Print Zones")
@Slf4j
public class PrintZoneController {

	@Autowired
	PrintZoneStubRepository stubRepository;

	@GetMapping("by-product/{productId}")
	public List<PrintZoneStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@GetMapping("{id}")
	public PrintZoneStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	@PostMapping("")
	public PrintZoneStub insert(@RequestBody PrintZoneStub document) {
		document.setId(null);
		return this.stubRepository.save(document);
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
