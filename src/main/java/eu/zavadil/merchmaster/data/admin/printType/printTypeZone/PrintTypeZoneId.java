package eu.zavadil.merchmaster.data.admin.printType.printTypeZone;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrintTypeZoneId implements Serializable {

	private int printTypeId;

	private int printZoneId;
}
