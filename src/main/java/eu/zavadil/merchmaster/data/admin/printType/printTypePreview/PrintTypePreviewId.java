package eu.zavadil.merchmaster.data.admin.printType.printTypePreview;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrintTypePreviewId implements Serializable {

	private int printTypeId;

	private int printPreviewId;
}
