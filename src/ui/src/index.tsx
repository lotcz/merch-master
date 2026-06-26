import {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shared/style/general.less";
import "./shared/style/index.css";
import "./shared/style/responsive.css";
import App from "./App";
import {BrowserRouter} from "react-router";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
	<StrictMode>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</StrictMode>
);
