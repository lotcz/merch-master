package eu.zavadil.merchmaster.api;

import eu.zavadil.merchmaster.api.payload.PrintPreviewPayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printPreviewZone.PrintPreviewZoneStub;
import eu.zavadil.merchmaster.data.printPreviewZone.PrintPreviewZoneStubRepository;
import eu.zavadil.merchmaster.service.PrintPreviewsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/print-previews")
@Tag(name = "Print Previews")
@Slf4j
public class PrintPreviewController {

	@Autowired
	PrintPreviewStubRepository stubRepository;

	@Autowired
	PrintPreviewZoneStubRepository previewZoneRepository;

	@Autowired
	PrintPreviewsService printPreviewsService;

	@GetMapping("by-product/{productId}")
	public List<PrintPreviewStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@GetMapping("{id}")
	public PrintPreviewPayload load(@PathVariable int id) {
		return this.printPreviewsService.load(id);
	}

	private PrintPreviewPayload savePayload(PrintPreviewPayload payload) {
		PrintPreviewStub stub = payload.getPrintPreview();
		stub = this.stubRepository.save(stub);

		int previewId = stub.getId();
		List<PrintPreviewZoneStub> zones = payload.getZones().stream().map(
			preview -> {
				preview.setPrintPreviewId(previewId);
				return this.previewZoneRepository.save(preview);
			}
		).toList();

		this.previewZoneRepository.cleanOtherPreviews(
			previewId,
			zones.stream().map(PrintPreviewZoneStub::getId).toList()
		);

		PrintPreviewPayload response = new PrintPreviewPayload();
		response.setPrintPreview(stub);
		response.setZones(zones);
		return response;
	}

	@PostMapping("")
	public PrintPreviewPayload insert(@RequestBody PrintPreviewPayload document) {
		document.getPrintPreview().setId(null);
		return this.savePayload(document);
	}

	@PutMapping("{id}")
	public PrintPreviewPayload update(@PathVariable int id, @RequestBody PrintPreviewPayload document) {
		document.getPrintPreview().setId(id);
		return this.savePayload(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
