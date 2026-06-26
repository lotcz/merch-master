package eu.zavadil.openmerch.data.designFile;

import eu.zavadil.openmerch.data.design.Design;
import eu.zavadil.openmerch.data.printZone.PrintZone;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "design_file")
public class DesignFile extends DesignFileBase {

	@ManyToOne(optional = false)
	private PrintZone printZone;

	@ManyToOne(optional = false)
	private Design design;
}
