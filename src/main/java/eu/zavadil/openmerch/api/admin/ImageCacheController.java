package eu.zavadil.openmerch.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.openmerch.data.imageCache.ImageCache;
import eu.zavadil.openmerch.data.imageCache.ImageCacheStub;
import eu.zavadil.openmerch.service.ImageCacheService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/image-cache")
@Tag(name = "Image Cache")
@Slf4j
public class ImageCacheController {

	@Autowired
	ImageCacheService imageCacheService;

	@GetMapping("")
	public JsonPage<ImageCache> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.imageCacheService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public ImageCacheStub load(@PathVariable int id) {
		return this.imageCacheService.loadStubById(id);
	}

	@PostMapping("")
	public ImageCacheStub insert(@RequestBody ImageCacheStub document) {
		document.setId(null);
		return this.imageCacheService.saveStub(document);
	}

	@PutMapping("{id}")
	public ImageCacheStub update(@PathVariable int id, @RequestBody ImageCacheStub document) {
		document.setId(id);
		return this.imageCacheService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.imageCacheService.delete(id);
	}

	@GetMapping("by-account/{accountId}")
	public JsonPage<ImageCache> loadAllByAccount(
		@PathVariable int accountId,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting) {
		return JsonPageImpl.of(this.imageCacheService.loadByAccountId(accountId, search, page, size, sorting));
	}
}
