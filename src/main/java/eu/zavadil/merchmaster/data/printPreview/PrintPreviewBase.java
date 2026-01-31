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

	private int imageWidthPx;

	private int imageHeightPx;

}
