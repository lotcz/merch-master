package eu.zavadil.merchmaster.data.account;

import eu.zavadil.java.spring.common.entity.EntityWithNameBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class AccountBase extends EntityWithNameBase {

	@JdbcTypeCode(SqlTypes.UUID)
	private UUID uuid;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private AccountState state = AccountState.Temporary;
}
