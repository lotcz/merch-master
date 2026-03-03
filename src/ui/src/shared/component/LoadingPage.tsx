import { PropsWithChildren, Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { Localize } from "zavadil-react-common";
import BrandLogo from "./brand/BrandLogo";

export function LoadingPage() {
	return (
		<div className="min-h-100 d-flex flex-column align-items-center justify-content-center gap-4">
			<BrandLogo size="md" />
			<Localize text="Loading..." />
			<Spinner variant="danger" />
		</div>
	);
}

export default function SuspensePage({ children }: PropsWithChildren) {
	return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
}
