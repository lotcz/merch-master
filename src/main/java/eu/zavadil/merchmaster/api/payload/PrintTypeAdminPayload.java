package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.admin.printType.PrintTypeStub;
import java.util.List;
import lombok.Data;

@Data
public class PrintTypeAdminPayload {

	private PrintTypeStub printType;

	private List<Integer> zones;

	private List<Integer> previews;
}
