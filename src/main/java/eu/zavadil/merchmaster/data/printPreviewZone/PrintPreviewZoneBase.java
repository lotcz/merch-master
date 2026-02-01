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

	private boolean aspectLocked = true;
}
