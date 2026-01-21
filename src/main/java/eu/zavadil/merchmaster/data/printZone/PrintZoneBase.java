package eu.zavadil.merchmaster.data.printZone;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PrintZoneBase extends EntityWithNameBase {

	private int width;

	private int height;
}
