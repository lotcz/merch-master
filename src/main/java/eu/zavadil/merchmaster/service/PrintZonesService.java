package eu.zavadil.merchmaster.service;

import eu.zavadil.merchmaster.api.payload.PrintZonePayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrintZonesService {

	@Autowired
	PrintZoneStubRepository zoneStubRepository;

	@Autowired
	PrintPreviewStubRepository previewStubRepository;

	public PrintZonePayload load(PrintZoneStub zone) {
		PrintZonePayload zonePayload = new PrintZonePayload();
		zonePayload.setPrintZone(zone);
		List<PrintPreviewStub> previews = this.previewStubRepository.findAllByPrintZoneId(zone.getId());
		zonePayload.setPreviews(previews);
		return zonePayload;
	}

	public PrintZonePayload load(int id) {
		PrintZoneStub zone = this.zoneStubRepository.findById(id).orElseThrow();
		return this.load(zone);
	}

}
