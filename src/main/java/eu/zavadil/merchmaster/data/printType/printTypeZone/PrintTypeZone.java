package eu.zavadil.merchmaster.data.printType.printTypeZone;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(
	name = "print_type_zone"
)
@IdClass(PrintTypeZoneId.class)
public class PrintTypeZone {

	@Column(name = "print_type_id")
	@Id
	private int printTypeId;

	@Column(name = "print_zone_id")
	@Id
	private int printZoneId;
}
