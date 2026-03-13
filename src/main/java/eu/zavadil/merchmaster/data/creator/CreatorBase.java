package eu.zavadil.merchmaster.data.creator;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.merchmaster.data.user.UserState;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class CreatorBase extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private UserState userState = UserState.Temporary;

}
