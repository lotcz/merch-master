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

	private int startXPx;

	private int startYPx;

	private int widthPx;

	private int heightPx;

	@Column(columnDefinition = "double precision DEFAULT 0", updatable = true, nullable = false)
	private double rotateDeg = 0;

	private boolean aspectLocked = true;
}
