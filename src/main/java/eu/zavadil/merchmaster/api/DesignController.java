package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.api.payload.DesignPayload;
import eu.zavadil.merchmaster.data.design.Design;
import eu.zavadil.merchmaster.data.design.DesignRepository;
import eu.zavadil.merchmaster.data.design.DesignStub;
import eu.zavadil.merchmaster.data.design.DesignStubRepository;
import eu.zavadil.merchmaster.data.designFile.DesignFileStub;
import eu.zavadil.merchmaster.data.designFile.DesignFileStubRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/designs")
@Tag(name = "Designs")
@Slf4j
public class DesignController {

	@Autowired
	DesignRepository repository;

	@Autowired
	DesignStubRepository stubRepository;

	@Autowired
	DesignFileStubRepository designFileStubRepository;

	@GetMapping("")
	public JsonPage<Design> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.repository.findAll(PagingUtils.of(page, size, sorting)));
	}

	@GetMapping("{id}")
	public DesignPayload load(@PathVariable int id) {
		DesignPayload result = new DesignPayload();
		result.setDesign(this.stubRepository.findById(id).orElseThrow());
		result.setFiles(this.designFileStubRepository.findAllByDesignId(id));
		return result;
	}

	private DesignPayload savePayload(DesignPayload payload) {
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

	@PostMapping("")
	public DesignPayload insert(@RequestBody DesignPayload document) {
		document.getDesign().setId(null);
		document.getFiles().forEach(file -> file.setId(null));
		return this.savePayload(document);
	}

	@PutMapping("{id}")
	public DesignPayload update(@PathVariable int id, @RequestBody DesignPayload document) {
		document.getDesign().setId(id);
		return this.savePayload(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.stubRepository.deleteById(id);
	}

}
