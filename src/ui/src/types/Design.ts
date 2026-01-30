import {EntityBase} from "zavadil-ts-common";
import {PrintType} from "./PrintType";
import {DesignFileStub} from "./DesignFile";
import {ProductColor} from "./ProductColor";

export type DesignBase = EntityBase & {
	uuid?: string | null;
	confirmed: boolean;
}

export type Design = DesignBase & {
	printType: PrintType;
	productColor: ProductColor;
}

export type DesignStub = DesignBase & {
	printTypeId: number;
	productColorId: number;
}

export type DesignPayload = {
	design: DesignStub;
	files: Array<DesignFileStub>;
}
