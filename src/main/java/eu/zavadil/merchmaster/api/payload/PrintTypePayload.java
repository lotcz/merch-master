package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import eu.zavadil.merchmaster.data.printZone.PrintZoneStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintTypePayload {

	private PrintTypeStub printType;

	private List<PrintZoneStub> zones;

	private List<PrintPreviewPayload> previews;

}
