package eu.zavadil.merchmaster.data.printPreviewZone;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "print_preview_zone",
	indexes = {
		@Index(columnList = "printPreviewId"),
	}
)
public class PrintPreviewZoneStub extends PrintPreviewZoneBase {

	@Column(name = "print_preview_id")
	private int printPreviewId;

	@Column(name = "print_zone_id")
	private int printZoneId;

}
