package eu.zavadil.merchmaster.data.printPreviewZone;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PrintPreviewZoneBase extends EntityBase {

	private double startXMm;

	private double startYMm;

	private double widthMm;

	private double heightMm;

	private boolean aspectLocked = true;
}
