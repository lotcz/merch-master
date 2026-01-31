package eu.zavadil.merchmaster.data.printPreviewZone;

import eu.zavadil.merchmaster.data.printPreview.PrintPreview;
import eu.zavadil.merchmaster.data.printPreview.PrintPreviewBase;
import eu.zavadil.merchmaster.data.printZone.PrintZone;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "print_preview_zone")
public class PrintPreviewZone extends PrintPreviewBase {

	@ManyToOne(optional = false)
	private PrintPreview printPreview;

	@ManyToOne(optional = false)
	private PrintZone printZone;

}
