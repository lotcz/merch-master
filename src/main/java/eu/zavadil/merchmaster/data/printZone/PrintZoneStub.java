package eu.zavadil.merchmaster.data.printZone;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "print_zone")
public class PrintZoneStub extends PrintZoneBase {

	@Column(name = "print_type_id")
	private int printTypeId;

}
