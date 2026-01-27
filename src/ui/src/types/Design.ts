import {EntityBase} from "zavadil-ts-common";
import {PrintType} from "./PrintType";
import {DesignFileStub} from "./DesignFile";

export type DesignBase = EntityBase & {
	uuid?: string | null;
}

export type Design = DesignBase & {
	printType?: PrintType | null;
}

export type DesignStub = DesignBase & {
	printTypeId?: number | null;
}

export type DesignPayload = {
	design: DesignStub;
	files: Array<DesignFileStub>;
}
