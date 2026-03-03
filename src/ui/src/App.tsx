import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shared/style/general.less";
import "./shared/style/index.css";
import "./shared/style/responsive.css";
import NotFound from "./shared/component/NotFoundPage";
import SuspensePage from "./shared/component/LoadingPage";

const AdminApp = React.lazy(() => import("./admin/component/AdminApp"));
const CreatorApp = React.lazy(() => import("./creator/component/CreatorApp"));
const DesignerApp = React.lazy(() => import("./designer/component/DesignerApp"));
const PublicApp = React.lazy(() => import("./public/component/PublicApp"));

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/admin/*"
					element={
						<SuspensePage>
							<AdminApp />
						</SuspensePage>
					}
				/>
				<Route
					path="/creator/*"
					element={
						<SuspensePage>
							<CreatorApp />
						</SuspensePage>
					}
				/>
				<Route
					path="/designer/*"
					element={
						<SuspensePage>
							<DesignerApp />
						</SuspensePage>
					}
				/>
				<Route
					path="/public"
					element={
						<SuspensePage>
							<PublicApp />
						</SuspensePage>
					}
				/>
				<Route
					path="/"
					element={
						<SuspensePage>
							<PublicApp />
						</SuspensePage>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
