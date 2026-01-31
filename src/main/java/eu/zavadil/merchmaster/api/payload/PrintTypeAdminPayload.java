package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.printType.PrintTypeStub;
import lombok.Data;

import java.util.List;

@Data
public class PrintTypeAdminPayload {

	private PrintTypeStub printType;

	private List<Integer> zones;

}
