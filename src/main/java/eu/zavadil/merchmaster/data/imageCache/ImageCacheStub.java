package eu.zavadil.merchmaster.data.imageCache;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "image_cache")
public class ImageCacheStub extends ImageCacheBase {

	@Column(name = "account_id")
	private int accountId;
}
