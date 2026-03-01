import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './shared/style/general.less';
import './shared/style/index.css';
import './shared/style/responsive.css';
import {BrowserRouter, Route, Routes} from "react-router";
import NotFound from "./shared/component/NotFound";
import {Spinner} from "react-bootstrap";

const AdminApp = React.lazy(() => import('./admin/component/AdminApp'));
const CreatorApp = React.lazy(() => import('./creator/component/CreatorApp'));
const DesignerApp = React.lazy(() => import('./designer/component/DesignerApp'));

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/admin/*" element={<Suspense fallback={<Spinner/>}><AdminApp/></Suspense>}/>
				<Route path="/creator/*" element={<CreatorApp/>}/>
				<Route path="/designer/*" element={<DesignerApp/>}/>
				<Route path="*" element={<NotFound/>}/>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
