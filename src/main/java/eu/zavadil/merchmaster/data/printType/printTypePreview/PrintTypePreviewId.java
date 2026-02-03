package eu.zavadil.merchmaster.data.printType.printTypePreview;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrintTypePreviewId implements Serializable {

	private int printTypeId;

	private int printPreviewId;
}
