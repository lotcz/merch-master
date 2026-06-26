package eu.zavadil.openmerch.api.payload;

import eu.zavadil.openmerch.data.printType.PrintTypeStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintTypeAdminPayload {

	private PrintTypeStub printType;

	private List<Integer> zones;

	private List<Integer> previews;
}
