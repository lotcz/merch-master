package eu.zavadil.merchmaster.data.creator.account;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "account", indexes = { @Index(columnList = "uuid", unique = true) })
public class AccountStub extends AccountBase {}
