package eu.zavadil.merchmaster.api;

import eu.zavadil.merchmaster.api.payload.PrintZonePayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import eu.zavadil.merchmaster.service.PrintZonesService;
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

	@Autowired
	PrintPreviewStubRepository previewStubRepository;

	@Autowired
	PrintZonesService printZonesService;

	@GetMapping("by-product/{productId}")
	public List<PrintZoneStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@GetMapping("{id}")
	public PrintZonePayload load(@PathVariable int id) {
		return this.printZonesService.load(id);
	}

	private PrintZonePayload savePayload(PrintZonePayload payload) {
		PrintZoneStub zoneStub = payload.getPrintZone();
		zoneStub = this.stubRepository.save(zoneStub);

		int zoneId = zoneStub.getId();
		List<PrintPreviewStub> previews = payload.getPreviews().stream().map(
			preview -> {
				preview.setPrintZoneId(zoneId);
				return this.previewStubRepository.save(preview);
			}
		).toList();

		this.previewStubRepository.deleteAllByPrintZoneIdAndIdNotIn(
			zoneId,
			previews.stream().map(PrintPreviewStub::getId).toList()
		);

		PrintZonePayload zoneResponse = new PrintZonePayload();
		zoneResponse.setPrintZone(zoneStub);
		zoneResponse.setPreviews(previews);
		return zoneResponse;
	}

	@PostMapping("")
	public PrintZonePayload insert(@RequestBody PrintZonePayload document) {
		document.getPrintZone().setId(null);
		return this.savePayload(document);
	}

	@PutMapping("{id}")
	public PrintZonePayload update(@PathVariable int id, @RequestBody PrintZonePayload document) {
		document.getPrintZone().setId(id);
		return this.savePayload(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
