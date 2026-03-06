package eu.zavadil.merchmaster.data.creator.user;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import eu.zavadil.merchmaster.data.SyncState;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class UserBase extends EntityWithNameBase {

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private UserState state = UserState.Temporary;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private SyncState syncState = SyncState.Pending;

	private String oauthSubject;

	private String email;
}
