import React, {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Button, Dropdown, Form, Spinner, Stack} from 'react-bootstrap';
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {MerchMasterRestClientContext} from "../../client/MerchMasterRestClient";
import {UserAlertsContext} from "../../util/UserAlerts";
import RefreshIconButton from "../general/RefreshIconButton";
import {Design} from "../../types/Design";
import ColorPreview from "../productColor/ColorPreview";
import {Product} from "../../types/Product";

const HEADER: SelectableTableHeader<Design> = [
	{name: 'id', label: 'ID'},
	{name: 'uuid', label: 'UUID'},
	{name: 'printType.product.name', label: 'Product'},
	{name: 'productColor.name', label: 'Color', renderer: (p) => p.productColor && <ColorPreview color={p.productColor}/>},
	{name: 'printType.name', label: 'Print Type'},
	{name: 'lastUpdatedOn', label: 'Updated', renderer: (p) => <DateTime value={p.lastUpdatedOn}/>},
	{name: 'createdOn', label: 'Created', renderer: (p) => <DateTime value={p.createdOn}/>}
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: 'lastUpdatedOn', desc: true}]};

export default function DesignsList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(MerchMasterRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<Design> | null>(null);
	const [products, setProducts] = useState<Array<Product>>();

	const paging = useMemo(
		() => StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING)
			: PagingUtil.pagingRequestFromString(pagingString),
		[pagingString]
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	useEffect(
		() => {
			restClient.products
				.loadPage({page: 0, size: 10})
				.then((p) => setProducts(p.content))
				.catch((e) => userAlerts.err(e));
		},
		[]
	);

	const navigateToCreateNew = useCallback(
		(productId: number) => {
			navigate(`/designs/detail/add/${productId}`)
		},
		[navigate]
	);

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/designs/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate]
	);

	const navigateToId = useCallback(
		(id: number) => {
			navigate(`/designs/detail/${id}`);
		},
		[navigate]
	);

	const navigateToDetail = useCallback(
		(p: Design) => {
			if (p.id) navigateToId(p.id);
		},
		[navigateToId]
	);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging);
		},
		[paging, searchInput, navigateToPage]
	);

	const loadPageHandler = useCallback(
		() => {
			setData(null);
			restClient
				.designs
				.loadPage(paging)
				.then(setData)
				.catch((e: Error) => {
					setData(null);
					userAlerts.err(e);
				});
		},
		[paging, restClient, userAlerts]
	);

	useEffect(loadPageHandler, [paging]);

	const reload = useCallback(
		() => {
			setData(null);
			loadPageHandler();
		},
		[loadPageHandler]
	);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<Dropdown>
						<Dropdown.Toggle variant="primary" className="d-flex align-items-center gap-2 border">Add +</Dropdown.Toggle>
						<Dropdown.Menu>
							{
								products ? products.map(
										(product, index) => <Dropdown.Item
											key={index}
											eventKey={String(product.id)}
											onClick={() => navigateToCreateNew(Number(product.id))}
										>
											{product.name}
										</Dropdown.Item>
									)
									: <Spinner/>
							}
						</Dropdown.Menu>
					</Dropdown>
					<div style={{width: '250px'}}>
						<Form onSubmit={applySearch} id="topics-search-form">
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={
									() => {
										setSearchInput('');
										navigateToPage(DEFAULT_PAGING);
									}
								}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
				</Stack>
			</div>

			<div className="px-3 gap-3">
				{
					(data === null) ? <TablePlaceholder/>
						: (
							<TableWithSelect
								showSelect={false}
								header={HEADER}
								paging={paging}
								totalItems={data.totalItems}
								onPagingChanged={navigateToPage}
								onClick={navigateToDetail}
								items={data.content}
								hover={true}
								striped={true}
							/>
						)
				}
			</div>
		</div>
	);
}

