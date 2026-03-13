package eu.zavadil.merchmaster.data.imageCache;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface ImageCacheRepository extends EntityRepository<ImageCache> {

	@Query(
		"""
				select ic
				from ImageCache ic
				where ic.imageName ILIKE %:search% or ic.originalImageName ILIKE %:search%
			"""
	)
	Page<ImageCache> search(String search, Pageable pr);

	@Query(
		"""
				select ic
				from ImageCache ic
				where ic.account.id = :accountId and (ic.imageName ILIKE %:search% or ic.originalImageName ILIKE %:search%)
			"""
	)
	Page<ImageCache> findByAccountId(int accountId, String search, Pageable p);
}
