import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/index.css';
import './style/responsive.css';
import App from './component/App';
import {BrowserRouter, Route, Routes} from "react-router";
import DesignerWrapper from "./component/designer/DesignerWrapper";

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/designer/:uuid" element={<DesignerWrapper/>}/>
				<Route path="*" element={<App/>}/>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
