import {useMemo} from "react";
import Logo from "./Logo";

export type BrandLogoProps = {
	size?: "sm" | "lg";
};

export default function BrandLogo({size}: BrandLogoProps) {
	const fontSize: string = useMemo(() => size || "md", [size]);
	return <div className={`brand-logo size-${fontSize}`}>
		<div className="d-flex align-items-center gap-2">
			<Logo size={size}/>
			<h1>
				<div className="strong">Merch</div>
				<div className="light">Master</div>
			</h1>
		</div>
	</div>
}

