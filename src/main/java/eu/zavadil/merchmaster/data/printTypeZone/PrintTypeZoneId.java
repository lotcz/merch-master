package eu.zavadil.merchmaster.data.printTypeZone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrintTypeZoneId implements Serializable {

	private int printTypeId;

	private int printZoneId;
}
