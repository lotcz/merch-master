package eu.zavadil.merchmaster.api;

import eu.zavadil.merchmaster.api.payload.PrintTypeAdminPayload;
import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.printType.printTypePreview.PrintTypePreview;
import eu.zavadil.merchmaster.data.printType.printTypePreview.PrintTypePreviewRepository;
import eu.zavadil.merchmaster.data.printType.printTypeZone.PrintTypeZone;
import eu.zavadil.merchmaster.data.printType.printTypeZone.PrintTypeZoneRepository;
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
	PrintTypePreviewRepository printTypePreviewRepository;

	@Autowired
	PrintTypeZoneRepository printTypeZoneRepository;

	@Autowired
	PrintTypesService printTypesService;

	@GetMapping("by-product/{productId}")
	public List<PrintTypeStub> loadByProduct(@PathVariable int productId) {
		return this.stubRepository.findAllByProductId(productId);
	}

	@GetMapping("{id}")
	public PrintTypeAdminPayload load(@PathVariable int id) {
		return this.printTypesService.loadAdmin(id);
	}

	private PrintTypeAdminPayload savePayload(PrintTypeAdminPayload payload) {
		PrintTypeStub stub = payload.getPrintType();
		stub = this.stubRepository.save(stub);
		int printTypeId = stub.getId();

		/* zones */

		payload.getZones().forEach(
			zoneId -> {
				PrintTypeZone ptz = new PrintTypeZone();
				ptz.setPrintTypeId(printTypeId);
				ptz.setPrintZoneId(zoneId);
				this.printTypeZoneRepository.save(ptz);
			}
		);

		this.printTypeZoneRepository.deleteAllByPrintTypeIdAndIdNotIn(
			printTypeId,
			payload.getZones()
		);

		/* previews */

		payload.getPreviews().forEach(
			previewId -> {
				PrintTypePreview ptp = new PrintTypePreview();
				ptp.setPrintTypeId(printTypeId);
				ptp.setPrintPreviewId(previewId);
				this.printTypePreviewRepository.save(ptp);
			}
		);

		this.printTypePreviewRepository.deleteAllByPrintTypeIdAndIdNotIn(
			printTypeId,
			payload.getPreviews()
		);

		return this.load(printTypeId);
	}

	@PostMapping("")
	public PrintTypeAdminPayload insert(@RequestBody PrintTypeAdminPayload document) {
		document.getPrintType().setId(null);
		return this.savePayload(document);
	}

	@PutMapping("{id}")
	public PrintTypeAdminPayload update(@PathVariable int id, @RequestBody PrintTypeAdminPayload document) {
		document.getPrintType().setId(id);
		return this.savePayload(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
