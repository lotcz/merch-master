package eu.zavadil.merchmaster.data.imageCache;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class ImageCacheBase extends EntityBase {

	private String imageName;

	private String originalImageName;

	private int originalImageWidthPx;

	private int originalImageHeightPx;
}
