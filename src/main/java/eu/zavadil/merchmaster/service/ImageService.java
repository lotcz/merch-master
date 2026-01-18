package eu.zavadil.merchmaster.service;

import eu.zavadil.java.imagez.client.ImagezClientHttp;
import eu.zavadil.java.imagez.client.ImagezSmartApi;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.image.Image;
import eu.zavadil.merchmaster.data.image.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ImageService {

	@Autowired
	ImageRepository imageRepository;

	final ImagezSmartApi imagez;

	public ImageService(
		@Value("${imagez.baseUrl}") String imagezBaseUrl,
		@Value("${imagez.secretToken}") String imagezSecretToken
	) {
		this.imagez = new ImagezClientHttp(imagezBaseUrl, imagezSecretToken);
	}

	@Transactional
	public Image save(Image image) {
		return this.imageRepository.save(image);
	}

	public Page<Image> search(String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.imageRepository.findAll(pr)
			: this.imageRepository.search(search, pr);
	}

	public Image loadById(int id) {
		return this.imageRepository.findById(id).orElse(null);
	}

	public Image requireById(int id) {
		return this.imageRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Image", id));
	}

	public Image loadByName(String name) {
		return this.imageRepository.findFirstByName(name).orElse(null);
	}

	public boolean nameExists(String name) {
		Image img = this.loadByName(name);
		return (img != null);
	}

	public void deleteById(int id) {
		// todo: check if can be deleted

		Image image = this.requireById(id);
		this.imageRepository.delete(image);

		if (!this.nameExists(image.getName())) {
			this.imagez.deleteOriginal(image.getName());
		}
	}

}
