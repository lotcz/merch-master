import {EntityBase} from "zavadil-ts-common";
import {PrintType} from "./PrintType";
import {DesignFileStub} from "./DesignFile";
import {ProductColor} from "./ProductColor";

export type DesignBase = EntityBase & {
	uuid?: string | null;
	confirmed: boolean;
}

export type Design = DesignBase & {
	printType?: PrintType | null;
	productColor?: ProductColor | null;
}

export type DesignStub = DesignBase & {
	printTypeId?: number | null;
	productColorId?: number | null;
}

export type DesignPayload = {
	design: DesignStub;
	files: Array<DesignFileStub>;
}
