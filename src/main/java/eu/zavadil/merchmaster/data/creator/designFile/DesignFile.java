package eu.zavadil.merchmaster.data.creator.designFile;

import eu.zavadil.merchmaster.data.admin.printZone.PrintZone;
import eu.zavadil.merchmaster.data.creator.design.Design;
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
