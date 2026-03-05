package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.creator.design.DesignStub;
import eu.zavadil.merchmaster.data.creator.designFile.DesignFileStub;
import java.util.List;
import lombok.Data;

@Data
public class DesignPayload {

	private DesignStub design;

	private List<DesignFileStub> files;
}
