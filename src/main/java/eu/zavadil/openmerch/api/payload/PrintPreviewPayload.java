package eu.zavadil.openmerch.api.payload;

import eu.zavadil.openmerch.data.printPreview.PrintPreviewStub;
import eu.zavadil.openmerch.data.printPreviewZone.PrintPreviewZoneStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintPreviewPayload {

	private PrintPreviewStub printPreview;

	private List<PrintPreviewZoneStub> zones;

}
