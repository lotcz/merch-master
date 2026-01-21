package eu.zavadil.merchmaster.data.design;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DesignBase extends EntityBase {

	private UUID uuid;

}
