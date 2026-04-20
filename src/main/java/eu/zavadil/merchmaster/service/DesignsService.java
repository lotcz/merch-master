package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.api.payload.DesignPayload;
import eu.zavadil.merchmaster.data.design.Design;
import eu.zavadil.merchmaster.data.design.DesignRepository;
import eu.zavadil.merchmaster.data.design.DesignStub;
import eu.zavadil.merchmaster.data.design.DesignStubRepository;
import eu.zavadil.merchmaster.data.designFile.DesignFileStub;
import eu.zavadil.merchmaster.data.designFile.DesignFileStubRepository;
import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printType.PrintTypeStubRepository;
import eu.zavadil.merchmaster.data.productColor.ProductColorStub;
import eu.zavadil.merchmaster.data.productColor.ProductColorStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DesignsService {

	@Autowired
	DesignRepository repository;

	@Autowired
	DesignStubRepository stubRepository;

	@Autowired
	DesignFileStubRepository designFileStubRepository;

	@Autowired
	PrintTypeStubRepository printTypeStubRepository;

	@Autowired
	ProductColorStubRepository productColorStubRepository;

	@Autowired
	ImageCacheService imageCacheService;

	private DesignStub saveDesign(DesignStub stub) {
		if (stub.getUuid() == null) {
			stub.setUuid(UUID.randomUUID());
		}

		PrintTypeStub printType = this.printTypeStubRepository.findById(stub.getPrintTypeId()).orElseThrow();
		ProductColorStub color = this.productColorStubRepository.findById(stub.getProductColorId()).orElseThrow();

		if (printType.getProductId() != color.getProductId()) {
			throw new BadRequestException("Print type and color must have the same product ID!");
		}

		return this.stubRepository.save(stub);
	}

	public Design loadFull(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public DesignPayload savePayload(DesignPayload payload) {
		DesignStub stub = this.saveDesign(payload.getDesign());
		int designId = stub.getId();

		List<DesignFileStub> files = payload
			.getFiles()
			.stream()
			.map(file -> {
				//todo: save image cache when we know account
				//this.imageCacheService.saveIfNotExistsAsync(payload.)

				file.setDesignId(designId);
				return this.designFileStubRepository.save(file);
			})
			.toList();

		this.designFileStubRepository.cleanOtherFiles(designId, files.stream().map(EntityBase::getId).toList());

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

	public Page<Design> loadByAccount(int accountId, int page, int size, String sorting) {
		return this.repository.loadByAccount(accountId, PagingUtils.of(page, size, sorting));
	}

	public Page<Design> searchByAccount(int accountId, String search, int page, int size, String sorting) {
		return this.repository.searchByAccount(accountId, search, PagingUtils.of(page, size, sorting));
	}
}
