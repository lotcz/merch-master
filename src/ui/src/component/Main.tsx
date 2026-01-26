import React from 'react';
import {Route, Routes} from 'react-router';
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";

import ProductsList from "./products/ProductsList";
import ProductDetail from "./products/ProductDetail";
import PrintTypeDetail from "./printType/PrintTypeDetail";
import ProductColorDetail from "./productColor/ProductColorDetail";

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
							<Route path="print-types">
								<Route path="detail">
									<Route path="add/:productId" element={<PrintTypeDetail/>}/>
									<Route path=":id" element={<PrintTypeDetail/>}/>
								</Route>
							</Route>
							<Route path="product-colors">
								<Route path="detail">
									<Route path="add/:productId" element={<ProductColorDetail/>}/>
									<Route path=":id" element={<ProductColorDetail/>}/>
								</Route>
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
