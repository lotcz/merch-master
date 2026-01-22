package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.printPreview.PrintPreviewStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintZonePayload {

	private PrintZoneStub printZone;

	private List<PrintPreviewStub> previews;

}
