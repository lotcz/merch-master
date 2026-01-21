package eu.zavadil.merchmaster.data.printZone;

import eu.zavadil.merchmaster.data.printType.PrintType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "print_zone")
public class PrintZone extends PrintZoneBase {

	@ManyToOne(optional = false)
	private PrintType printType;

}
