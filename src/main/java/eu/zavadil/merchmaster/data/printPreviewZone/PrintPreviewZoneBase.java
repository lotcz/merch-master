package eu.zavadil.merchmaster.data.printPreviewZone;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PrintPreviewZoneBase extends EntityBase {

	private int startXPx;

	private int startYPx;

	private int widthPx;

	private int heightPx;

	private double rotateDeg = 0;

	private boolean aspectLocked = true;

	private boolean useCylinderEffect = false;

	private int cylinderSlices = 10;

	private double cylinderVerticalAngle = 0;

	private double cylinderPerspective = 1000;

	private int cylinderRadius = 60;

	private double cylinderStartAngle = -75;

	private double cylinderEndAngle = 75;

}
