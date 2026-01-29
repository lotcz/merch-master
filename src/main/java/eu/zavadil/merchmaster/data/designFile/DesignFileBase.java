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

	private double positionX;

	private double positionY;

	private double imageWidth;

	private double imageHeight;

}
