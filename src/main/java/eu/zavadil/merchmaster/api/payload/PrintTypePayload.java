package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.admin.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.admin.printZone.PrintZoneStub;
import java.util.List;
import lombok.Data;

@Data
public class PrintTypePayload {

	private PrintTypeStub printType;

	private List<PrintZoneStub> zones;

	private List<PrintPreviewPayload> previews;
}
