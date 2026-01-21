package eu.zavadil.merchmaster.data.printType;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PrintTypeBase extends EntityWithNameBase {

}
