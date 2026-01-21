package eu.zavadil.merchmaster.data.designFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "design_file")
public class DesignFileStub extends DesignFileBase {

	@Column(name = "print_zone_id")
	private int printZoneId;

	@Column(name = "design_id")
	private int designId;
}
