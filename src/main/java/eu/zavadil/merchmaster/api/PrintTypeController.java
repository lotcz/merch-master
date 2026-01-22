package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.api.payload.PrintTypePayload;
import eu.zavadil.merchmaster.api.payload.PrintZonePayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printType.PrintType;
import eu.zavadil.merchmaster.data.printType.PrintTypeRepository;
import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
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
	PrintTypeRepository repository;

	@Autowired
	PrintTypeStubRepository stubRepository;

	@Autowired
	PrintZoneStubRepository zoneStubRepository;

	@Autowired
	PrintPreviewStubRepository previewStubRepository;

	@GetMapping("")
	public JsonPage<PrintType> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.search(search, PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("{id}")
	public PrintTypeStub load(@PathVariable int id) {
		return this.stubRepository.findById(id).orElseThrow();
	}

	private PrintTypePayload savePayload(PrintTypePayload payload) {
		PrintTypeStub stub = payload.getPrintType();

		stub = this.stubRepository.save(stub);

		List<PrintZonePayload> zones = payload.getZones().stream().map(
			zone -> {
				PrintZoneStub zoneStub = zone.getPrintZone();
				zoneStub.setId(null);
				zoneStub = this.zoneStubRepository.save(zoneStub);

				List<PrintPreviewStub> previews = zone.getPreviews().stream().map(
					preview -> this.previewStubRepository.save(preview)
				).toList();

				this.previewStubRepository.deleteAllByPrintZoneIdAndIdNotIn(
					zoneStub.getId(),
					previews.stream().map(PrintPreviewStub::getId).toList()
				);

				PrintZonePayload zoneResponse = new PrintZonePayload();
				zoneResponse.setPrintZone(zoneStub);
				zoneResponse.setPreviews(previews);
				return zoneResponse;
			}
		).toList();

		this.zoneStubRepository.deleteAllByPrintTypeIdAndIdNotIn(
			stub.getId(),
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
