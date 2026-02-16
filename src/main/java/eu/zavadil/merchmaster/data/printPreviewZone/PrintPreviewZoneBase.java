package eu.zavadil.merchmaster.data.printPreviewZone;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PrintPreviewZoneBase extends EntityBase {

	private int startXPx = 0;

	private int startYPx = 0;

	private int widthPx = 100;

	private int heightPx = 100;

	private double rotateDeg = 0;

	private double skewXDeg = 0;

	private double skewYDeg = 0;

	private boolean aspectLocked = true;

	private boolean useCylinderEffect = false;

	private int cylinderSlices = 10;

	private double cylinderVerticalAngle = 0;

	private double cylinderPerspective = 1000;

	private int cylinderRadius = 60;

	private double cylinderStartAngle = -75;

	private double cylinderEndAngle = 75;

	@Column(columnDefinition = "boolean DEFAULT false", nullable = false)
	private boolean useViewCrop = false;

	@Column(columnDefinition = "double precision DEFAULT 0", nullable = false)
	private double viewCropOffsetXMm = 0;

	@Column(columnDefinition = "double precision DEFAULT 0", nullable = false)
	private double viewCropOffsetYMm = 0;

	@Column(columnDefinition = "double precision DEFAULT 0", nullable = false)
	private double viewCropWidthMm = 0;

	@Column(columnDefinition = "double precision DEFAULT 0", nullable = false)
	private double viewCropHeightMm = 0;

}
