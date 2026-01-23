import React from 'react';
import {Route, Routes} from 'react-router';
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";

import ProductsList from "./products/ProductsList";
import ProductDetail from "./products/ProductDetail";

export default function Main() {
	return (
		<main>
			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1 pb-4">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>

						<Route path="products">
							<Route path="" element={<ProductsList/>}/>
							<Route path="detail">
								<Route path="add" element={<ProductDetail/>}/>
								<Route path=":id" element={<ProductDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<ProductsList/>}/>
						</Route>

						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}
