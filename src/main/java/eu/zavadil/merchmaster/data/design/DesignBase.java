package eu.zavadil.merchmaster.data.design;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DesignBase extends EntityBase {

	@Column(columnDefinition = "uuid DEFAULT gen_random_uuid()", updatable = false, nullable = false)
	@JdbcTypeCode(SqlTypes.UUID)
	private UUID uuid;

	private boolean confirmed = false;
}
