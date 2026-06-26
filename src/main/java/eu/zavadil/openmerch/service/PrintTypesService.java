package eu.zavadil.openmerch.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.openmerch.api.payload.PrintTypeAdminPayload;
import eu.zavadil.openmerch.api.payload.PrintTypePayload;
import eu.zavadil.openmerch.data.printPreview.PrintPreviewStub;
import eu.zavadil.openmerch.data.printPreview.PrintPreviewStubRepository;
import eu.zavadil.openmerch.data.printType.PrintTypeStubRepository;
import eu.zavadil.openmerch.data.printZone.PrintZoneStub;
import eu.zavadil.openmerch.data.printZone.PrintZoneStubRepository;
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

	@Autowired
	PrintPreviewsService printPreviewsService;

	public PrintTypePayload load(int id) {
		PrintTypePayload response = new PrintTypePayload();
		response.setPrintType(this.stubRepository.findById(id).orElseThrow());
		response.setZones(this.zoneStubRepository.findAllByPrintTypeId(id));
		response.setPreviews(
			this.previewStubRepository.findAllByPrintTypeId(id)
				.stream()
				.map(p -> this.printPreviewsService.load(p))
				.toList()
		);

		return response;
	}

	public PrintTypeAdminPayload loadAdmin(int id) {
		PrintTypeAdminPayload response = new PrintTypeAdminPayload();
		response.setPrintType(this.stubRepository.findById(id).orElseThrow());

		List<PrintZoneStub> zones = this.zoneStubRepository.findAllByPrintTypeId(id);
		response.setZones(zones.stream().map(EntityBase::getId).toList());

		List<PrintPreviewStub> previews = this.previewStubRepository.findAllByPrintTypeId(id);
		response.setPreviews(previews.stream().map(EntityBase::getId).toList());

		return response;
	}
}
