import {Route, Routes} from "react-router";
import Dashboard from "./dashboard/Dashboard";
import MainMenu from "./MainMenu";
import {Stack} from "react-bootstrap";

import ProductsList from "./products/ProductsList";
import ProductDetail from "./products/ProductDetail";
import PrintTypeDetail from "./printType/PrintTypeDetail";
import ProductColorDetail from "./productColor/ProductColorDetail";
import DesignsList from "./designs/DesignsList";
import DesignDetail from "./designs/DesignDetail";
import PrintZoneDetail from "./printZone/PrintZoneDetail";
import PrintPreviewDetail from "./printPreview/PrintPreviewDetail";
import AccountsList from "./account/AccountsList";
import AccountDetail from "./account/AccountDetail";
import ShopsList from "./shop/ShopsList";
import ShopDetail from "./shop/ShopDetail";
import UsersList from "./user/UsersList";
import UserDetail from "./user/UserDetail";
import ImageCacheDetail from "./imageCache/ImageCacheDetail";
import CreatorDetail from "./creator/CreatorDetail";
import ShopProductDetail from "./shopProduct/ShopProductDetail";
import ShopCategoryDetail from "./shopCategory/ShopCategoryDetail";
import ShopCustomerDetail from "./shopCustomer/ShopCustomerDetail";
import ShopOrderDetail from "./shopOrder/ShopOrderDetail";
import OrdersList from "./shopOrder/OrdersList";

export default function Main() {
	return (
		<main>
			<Stack direction="horizontal" className="align-items-stretch">
				<MainMenu/>
				<div className="flex-grow-1 pb-4">
					<Routes>
						<Route path="/" element={<Dashboard/>}/>
						<Route path="dashboard" element={<Dashboard/>}/>

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
							<Route path="print-zones">
								<Route path="detail">
									<Route path="add/:productId" element={<PrintZoneDetail/>}/>
									<Route path=":id" element={<PrintZoneDetail/>}/>
								</Route>
							</Route>
							<Route path="print-previews">
								<Route path="detail">
									<Route path="add/:productId" element={<PrintPreviewDetail/>}/>
									<Route path=":id" element={<PrintPreviewDetail/>}/>
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

						<Route path="accounts">
							<Route path="" element={<AccountsList/>}/>
							<Route path="detail">
								<Route path="add" element={<AccountDetail/>}/>
								<Route path=":id" element={<AccountDetail/>}/>
							</Route>
							<Route path="creators">
								<Route path="detail">
									<Route path="add/:accountId" element={<CreatorDetail/>}/>
									<Route path=":id" element={<CreatorDetail/>}/>
								</Route>
							</Route>
							<Route path="image-cache">
								<Route path="detail">
									<Route path="add/:accountId" element={<ImageCacheDetail/>}/>
									<Route path=":id" element={<ImageCacheDetail/>}/>
								</Route>
							</Route>
							<Route path=":pagingString" element={<AccountsList/>}/>
						</Route>

						<Route path="shops">
							<Route path="" element={<ShopsList/>}/>
							<Route path="detail">
								<Route path="add/:accountId" element={<ShopDetail/>}/>
								<Route path=":id" element={<ShopDetail/>}/>
							</Route>
							<Route path="products">
								<Route path="detail">
									<Route path="add/:shopId" element={<ShopProductDetail/>}/>
									<Route path=":id" element={<ShopProductDetail/>}/>
								</Route>
							</Route>
							<Route path="categories">
								<Route path="detail">
									<Route path="add/:shopId" element={<ShopCategoryDetail/>}/>
									<Route path=":id" element={<ShopCategoryDetail/>}/>
								</Route>
							</Route>
							<Route path="customers">
								<Route path="detail">
									<Route path="add/:shopId" element={<ShopCustomerDetail/>}/>
									<Route path=":id" element={<ShopCustomerDetail/>}/>
								</Route>
							</Route>
							<Route path=":pagingString" element={<ShopsList/>}/>
						</Route>

						<Route path="orders">
							<Route path="detail">
								<Route path="add/:customerId" element={<ShopOrderDetail/>}/>
								<Route path=":id" element={<ShopOrderDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<OrdersList/>}/>
							<Route path="" element={<OrdersList/>}/>
						</Route>

						<Route path="users">
							<Route path="" element={<UsersList/>}/>
							<Route path="detail">
								<Route path="add" element={<UserDetail/>}/>
								<Route path=":id" element={<UserDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<UsersList/>}/>
						</Route>

						<Route path="designs">
							<Route path="" element={<DesignsList/>}/>
							<Route path="detail">
								<Route path="add/:productId" element={<DesignDetail/>}/>
								<Route path=":id" element={<DesignDetail/>}/>
							</Route>
							<Route path=":pagingString" element={<DesignsList/>}/>
						</Route>

						<Route path="*" element={<span>404</span>}/>
					</Routes>
				</div>
			</Stack>
		</main>
	);
}
