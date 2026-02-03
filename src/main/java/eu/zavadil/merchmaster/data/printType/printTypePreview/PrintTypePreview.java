package eu.zavadil.merchmaster.data.printType.printTypePreview;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(
	name = "print_type_preview"
)
@IdClass(PrintTypePreviewId.class)
public class PrintTypePreview {

	@Column(name = "print_type_id")
	@Id
	private int printTypeId;

	@Column(name = "print_preview_id")
	@Id
	private int printPreviewId;
}
