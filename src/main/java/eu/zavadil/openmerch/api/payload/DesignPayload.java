package eu.zavadil.openmerch.api.payload;

import eu.zavadil.openmerch.data.design.DesignStub;
import eu.zavadil.openmerch.data.designFile.DesignFileStub;
import lombok.Data;

import java.util.List;

@Data
public class DesignPayload {

	private DesignStub design;

	private List<DesignFileStub> files;
}
