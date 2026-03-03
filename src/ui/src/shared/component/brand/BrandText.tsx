import { useMemo } from "react";
import { SizeProps } from "../../types/SizeProps";

export type BrandTextProps = SizeProps;

export default function BrandText({ size }: BrandTextProps) {
	const fontSize: string = useMemo(() => size || "md", [size]);
	return (
		<div className={`brand-text size-${fontSize}`}>
			<h1>
				<div className="strong">Merch</div>
				<div className="light">Master</div>
			</h1>
		</div>
	);
}
