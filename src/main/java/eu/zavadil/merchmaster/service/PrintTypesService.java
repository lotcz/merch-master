package eu.zavadil.merchmaster.service;

import eu.zavadil.merchmaster.api.payload.PrintTypePayload;
import eu.zavadil.merchmaster.api.payload.PrintZonePayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrintTypesService {

	@Autowired
	PrintTypeStubRepository stubRepository;

	@Autowired
	PrintZoneStubRepository zoneStubRepository;

	@Autowired
	PrintPreviewStubRepository previewStubRepository;

	public PrintTypePayload load(int id) {
		PrintTypePayload response = new PrintTypePayload();
		response.setPrintType(this.stubRepository.findById(id).orElseThrow());

		List<PrintZoneStub> zones = this.zoneStubRepository.findAllByPrintTypeId(id);
		List<PrintZonePayload> zonesPayload = zones.stream().map(
			zone -> {
				PrintZonePayload zonePayload = new PrintZonePayload();
				zonePayload.setPrintZone(zone);
				List<PrintPreviewStub> previews = this.previewStubRepository.findAllByPrintZoneId(zone.getId());
				zonePayload.setPreviews(previews);
				return zonePayload;
			}
		).toList();
		response.setZones(zonesPayload);

		return response;
	}

}
