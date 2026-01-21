package eu.zavadil.merchmaster.service;

import eu.zavadil.java.imagez.client.ImagezClientHttp;
import eu.zavadil.java.imagez.client.ImagezSmartApi;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.merchmaster.data.product.Product;
import eu.zavadil.merchmaster.data.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

	@Autowired
	ProductRepository productRepository;

	final ImagezSmartApi imagez;

	public ProductService(
		@Value("${imagez.baseUrl}") String imagezBaseUrl,
		@Value("${imagez.secretToken}") String imagezSecretToken
	) {
		this.imagez = new ImagezClientHttp(imagezBaseUrl, imagezSecretToken);
	}

	@Transactional
	public Product save(Product image) {
		return this.productRepository.save(image);
	}

	public Page<Product> search(String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.productRepository.findAll(pr)
			: this.productRepository.search(search, pr);
	}

	public Product loadById(int id) {
		return this.productRepository.findById(id).orElse(null);
	}

	public Product requireById(int id) {
		return this.productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Image", id));
	}

	public void deleteById(int id) {
		Product image = this.requireById(id);
		this.productRepository.delete(image);
	}

}
