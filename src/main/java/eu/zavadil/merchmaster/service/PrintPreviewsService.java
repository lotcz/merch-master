package eu.zavadil.merchmaster.service;

import eu.zavadil.merchmaster.api.payload.PrintPreviewPayload;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
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

	public PrintPreviewPayload load(PrintPreviewStub stub) {
		PrintPreviewPayload response = new PrintPreviewPayload();
		response.setPrintPreview(stub);
		response.setZones(this.zoneStubRepository.findAllByPrintPreviewId(stub.getId()));
		return response;
	}

	public PrintPreviewPayload load(int id) {
		PrintPreviewStub stub = this.stubRepository.findById(id).orElseThrow();
		return this.load(stub);
	}

}
