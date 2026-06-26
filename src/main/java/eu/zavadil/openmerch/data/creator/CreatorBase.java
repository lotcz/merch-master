package eu.zavadil.openmerch.data.creator;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.openmerch.data.user.UserState;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class CreatorBase extends EntityBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private UserState userState = UserState.Temporary;

}
