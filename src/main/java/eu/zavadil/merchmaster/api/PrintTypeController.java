package eu.zavadil.merchmaster.api;

import eu.zavadil.merchmaster.api.payload.PrintTypePayload;
import eu.zavadil.merchmaster.api.payload.PrintZonePayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import eu.zavadil.merchmaster.service.PrintTypesService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/print-types")
@Tag(name = "Print Types")
@Slf4j
public class PrintTypeController {

	@Autowired
	PrintTypeStubRepository stubRepository;

	@Autowired
	PrintZoneStubRepository zoneStubRepository;

	@Autowired
	PrintPreviewStubRepository previewStubRepository;

	@Autowired
	PrintTypesService printTypesService;

	@GetMapping("by-product/{productId}")
	public List<PrintTypeStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@GetMapping("{id}")
	public PrintTypePayload load(@PathVariable int id) {
		return this.printTypesService.load(id);
	}

	private PrintTypePayload savePayload(PrintTypePayload payload) {
		PrintTypeStub stub = payload.getPrintType();
		stub = this.stubRepository.save(stub);
		int printTypeId = stub.getId();

		List<PrintZonePayload> zones = payload.getZones().stream().map(
			zone -> {
				PrintZoneStub zoneStub = zone.getPrintZone();
				zoneStub.setPrintTypeId(printTypeId);
				zoneStub = this.zoneStubRepository.save(zoneStub);

				int zoneId = zoneStub.getId();
				List<PrintPreviewStub> previews = zone.getPreviews().stream().map(
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
		).toList();

		this.zoneStubRepository.deleteAllByPrintTypeIdAndIdNotIn(
			printTypeId,
			zones.stream().map(z -> z.getPrintZone().getId()).toList()
		);

		PrintTypePayload response = new PrintTypePayload();
		response.setPrintType(stub);
		response.setZones(zones);
		return response;
	}

	@PostMapping("")
	public PrintTypePayload insert(@RequestBody PrintTypePayload document) {
		document.getPrintType().setId(null);
		document.getZones().forEach(
			zone -> {
				zone.getPrintZone().setId(null);
				zone.getPreviews().forEach(preview -> preview.setId(null));
			});
		return this.savePayload(document);
	}

	@PutMapping("{id}")
	public PrintTypePayload update(@PathVariable int id, @RequestBody PrintTypePayload document) {
		document.getPrintType().setId(id);
		return this.savePayload(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
