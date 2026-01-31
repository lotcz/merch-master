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

	private int originalImageWidthPx;

	private int originalImageHeightPx;

	private double positionXMm;

	private double positionYMm;

	private double imageWidthMm;

	private double imageHeightMm;

	private boolean aspectLocked = true;

}
