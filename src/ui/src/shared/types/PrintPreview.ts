import {EntityWithName} from "zavadil-ts-common";
import {Product} from "./Product";
import {PrintPreviewZoneStub} from "./PrintPreviewZone";

export type PrintPreviewBase = EntityWithName & {
	imageName?: string | null;
	foregroundName?: string | null;
	imageWidthPx: number;
	imageHeightPx: number;
}

export type PrintPreview = PrintPreviewBase & {
	product: Product;
}

export type PrintPreviewStub = PrintPreviewBase & {
	productId: number;
}

export type PrintPreviewPayload = {
	printPreview: PrintPreviewStub;
	zones: Array<PrintPreviewZoneStub>;
}
