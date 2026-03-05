package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.admin.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.admin.printPreviewZone.PrintPreviewZoneStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintPreviewPayload {

	private PrintPreviewStub printPreview;

	private List<PrintPreviewZoneStub> zones;

}
