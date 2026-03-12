package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.creator.imageCache.ImageCache;
import eu.zavadil.merchmaster.data.creator.imageCache.ImageCacheRepository;
import eu.zavadil.merchmaster.data.creator.imageCache.ImageCacheStub;
import eu.zavadil.merchmaster.data.creator.imageCache.ImageCacheStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ImageCacheService {

	@Autowired
	ImageCacheStubRepository stubRepository;

	@Autowired
	ImageCacheRepository repository;

	public Page<ImageCache> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public ImageCache loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public ImageCacheStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public ImageCacheStub loadByName(int accountId, String name) {
		return this.stubRepository.findFirstByImageNameAndAccountId(name, accountId).orElse(null);
	}

	public ImageCache save(ImageCache shop) {
		return this.repository.save(shop);
	}

	public ImageCacheStub saveStub(ImageCacheStub shopStub) {
		return this.stubRepository.save(shopStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(ImageCacheStub shopStub) {
		if (shopStub.getId() != null) this.delete(shopStub.getId());
	}

	public void delete(ImageCache shop) {
		if (shop.getId() != null) this.delete(shop.getId());
	}

	public Page<ImageCache> loadByAccountId(int accountId, String search, int page, int size, String sorting) {
		return this.repository.findByAccountId(accountId, search, PagingUtils.of(page, size, sorting));
	}

	@Async
	public ImageCacheStub saveIfNotExistsAsync(int accountId, String name, String originalName, int width, int height) {
		ImageCacheStub stub = this.loadByName(accountId, name);
		if (stub == null) {
			stub = new ImageCacheStub();
			stub.setAccountId(accountId);
			stub.setImageName(name);
		}
		if (!(
			StringUtils.safeEquals(stub.getOriginalImageName(), originalName))
			&& stub.getOriginalImageHeightPx() == height
			&& stub.getOriginalImageWidthPx() == width
		) {
			return this.saveStub(stub);
		}
		return stub;
	}
}
