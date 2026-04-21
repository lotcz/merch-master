import {EntityBase} from "zavadil-ts-common";
import {PrintType} from "./PrintType";
import {DesignFileStub} from "./DesignFile";
import {ProductColor} from "./ProductColor";
import {Account} from "./Account";

export type DesignBase = EntityBase & {
	uuid?: string | null;
	confirmed: boolean;
	description?: string | null;
}

export type Design = DesignBase & {
	account?: Account | null;
	printType: PrintType;
	productColor: ProductColor;
}

export type DesignStub = DesignBase & {
	accountId?: number | null;
	printTypeId: number;
	productColorId: number;
}

export type DesignPayload = {
	design: DesignStub;
	files: Array<DesignFileStub>;
}
