package eu.zavadil.merchmaster.data.creator.design;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DesignBase extends EntityBase {

	@JdbcTypeCode(SqlTypes.UUID)
	private UUID uuid;

	private boolean confirmed = false;
}
