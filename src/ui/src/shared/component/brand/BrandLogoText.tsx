import { useMemo } from "react";
import { SizeProps } from "../../types/SizeProps";
import BrandLogo from "./BrandLogo";
import BrandText from "./BrandText";

export type BrandLogoProps = SizeProps & {
	vertical?: boolean;
};

export default function BrandLogoText({ size, vertical }: BrandLogoProps) {
	const direction: string = useMemo(() => (vertical ? "flex-column" : ""), [vertical]);
	return (
		<div className={`brand-logo-text d-flex align-items-center gap-2 ${direction}`}>
			<BrandLogo size={size} />
			<BrandText size={size} />
		</div>
	);
}
