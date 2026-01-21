package eu.zavadil.merchmaster.data.printPreview;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PrintPreviewBase extends EntityWithNameBase {

	private String imageName;

	private int imageWidth;

	private int imageHeight;

	private int zoneStartX;

	private int zoneStartY;

	private int zoneWidth;

	private int zoneHeight;
}
