package eu.zavadil.merchmaster.api.payload;

import eu.zavadil.merchmaster.data.design.DesignStub;
import eu.zavadil.merchmaster.data.designFile.DesignFileStub;
import lombok.Data;

import java.util.List;

@Data
public class DesignPayload {

	private DesignStub design;

	private List<DesignFileStub> files;

}
