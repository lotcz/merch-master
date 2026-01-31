package eu.zavadil.merchmaster.service;

import eu.zavadil.merchmaster.api.payload.PrintPreviewPayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.merchmaster.data.printPreviewZone.PrintPreviewZoneStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrintPreviewsService {

	@Autowired
	PrintPreviewStubRepository stubRepository;

	@Autowired
	PrintPreviewZoneStubRepository zoneStubRepository;

	public PrintPreviewPayload load(int id) {
		PrintPreviewPayload response = new PrintPreviewPayload();
		response.setPrintPreview(this.stubRepository.findById(id).orElseThrow());
		response.setZones(this.zoneStubRepository.findAllByPrintPreviewId(id));
		return response;
	}

}
