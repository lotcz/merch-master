import React from 'react';
import {Route, Routes} from 'react-router';
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";

import ImagesList from "./images/ImagesList";
import ImageDetail from "./images/ImageDetail";

export default function Main() {
	return (
		<main>
			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1 pb-4">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>

						<Route path="images">
							<Route path="" element={<ImagesList/>}/>
							<Route path="detail">
								<Route path="add" element={<ImageDetail/>}/>
								<Route path=":id" element={<ImageDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<ImagesList/>}/>
						</Route>

						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}
