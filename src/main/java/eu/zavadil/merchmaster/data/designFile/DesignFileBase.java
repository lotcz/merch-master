package eu.zavadil.merchmaster.data.designFile;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DesignFileBase extends EntityBase {

	private String imageName;

	private int originalImageWidth;

	private int originalImageHeight;

	private int positionX;

	private int positionY;

	private int imageWidth;

	private int imageHeight;

}
