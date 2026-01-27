package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.merchmaster.api.payload.DesignPayload;
import eu.zavadil.merchmaster.data.design.DesignStub;
import eu.zavadil.merchmaster.data.design.DesignStubRepository;
import eu.zavadil.merchmaster.data.designFile.DesignFileStub;
import eu.zavadil.merchmaster.data.designFile.DesignFileStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@Service
public class DesignsService {

	@Autowired
	DesignStubRepository stubRepository;

	@Autowired
	DesignFileStubRepository designFileStubRepository;

	public DesignPayload savePayload(DesignPayload payload) {
		DesignStub stub = payload.getDesign();
		stub = this.stubRepository.save(stub);
		int designId = stub.getId();

		List<DesignFileStub> files = payload.getFiles().stream().map(
			file -> {
				file.setDesignId(designId);
				return this.designFileStubRepository.save(file);
			}
		).toList();

		this.designFileStubRepository.deleteAllByDesignIdAndIdNotIn(
			designId,
			files.stream().map(EntityBase::getId).toList()
		);

		DesignPayload response = new DesignPayload();
		response.setDesign(stub);
		response.setFiles(files);
		return response;
	}

	public DesignPayload loadPayload(int id) {
		DesignPayload result = new DesignPayload();
		result.setDesign(this.stubRepository.findById(id).orElseThrow());
		result.setFiles(this.designFileStubRepository.findAllByDesignId(id));
		return result;
	}

	public DesignPayload loadPayload(UUID uuid) {
		DesignPayload result = new DesignPayload();
		DesignStub stub = this.stubRepository.findByUuid(uuid).orElseThrow();
		result.setDesign(stub);
		result.setFiles(this.designFileStubRepository.findAllByDesignId(stub.getId()));
		return result;
	}

}
