package eu.zavadil.openmerch.api.payload;

import eu.zavadil.openmerch.data.printType.PrintTypeStub;
import eu.zavadil.openmerch.data.printZone.PrintZoneStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintTypePayload {

	private PrintTypeStub printType;

	private List<PrintZoneStub> zones;

	private List<PrintPreviewPayload> previews;
}
