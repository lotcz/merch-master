package eu.zavadil.merchmaster.data.printPreview;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "print_preview")
public class PrintPreviewStub extends PrintPreviewBase {

	@Column(name = "print_zone_id")
	private int printZoneId;

}
