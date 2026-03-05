import { Route, Routes } from "react-router";
import DesignerWrapper from "./DesignerWrapper";
import NotFound from "../../shared/component/NotFoundPage";

export default function DesignerApp() {
	return (
		<Routes>
			<Route path=":uuid" element={<DesignerWrapper />} />
			<Route path="add/:productId" element={<DesignerWrapper />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
