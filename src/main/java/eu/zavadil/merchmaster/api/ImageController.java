package eu.zavadil.merchmaster.api;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.image.Image;
import eu.zavadil.merchmaster.service.ImageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/images")
@Tag(name = "Images")
@Slf4j
public class ImageController {

	@Value("${imagez.baseUrl}")
	String imagezBaseUrl;

	@Value("${imagez.secretToken}")
	String imagezSecretToken;

	@Autowired
	ImageService imageService;

	// IMAGE DATA

	@GetMapping("")
	public JsonPage<Image> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.imageService.search(search, PagingUtils.of(page, size, sorting)));
	}

	@PostMapping("")
	public Image insert(@RequestBody Image document) {
		document.setId(null);
		return this.imageService.save(document);
	}

	@GetMapping("{id}")
	public Image load(@PathVariable int id) {
		return this.imageService.requireById(id);
	}

	@PutMapping("{id}")
	public Image update(@PathVariable int id, @RequestBody Image document) {
		document.setId(id);
		return this.imageService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.imageService.deleteById(id);
	}


}
