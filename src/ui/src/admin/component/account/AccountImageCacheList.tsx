import {FormEvent, useCallback, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {useAdminRestClient} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import {Button, Form} from "react-bootstrap";
import {ImageCache} from "../../../shared/types/Image";
import {Page, PagingRequest} from "zavadil-ts-common";
import {ImagezImageThumb} from "../../../shared/component/images/ImagezImage";

const HEADER: SelectableTableHeader<ImageCache> = [
	{name: "imageName", label: "Preview", renderer: (i) => <ImagezImageThumb name={i.imageName}/>},
	{name: "imageName", label: "Name"},
	{name: "originalImageName", label: "Original Name"},
	{name: "lastUpdatedOn", label: "Updated", renderer: (p) => <DateTime value={p.lastUpdatedOn}/>},
	{name: "createdOn", label: "Created", renderer: (p) => <DateTime value={p.createdOn}/>},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 10, sorting: [{name: "lastUpdatedOn", desc: true}]};

export type AccountImageCacheListProps = {
	accountId: number;
};

export default function AccountImageCacheList({accountId}: AccountImageCacheListProps) {
	const navigate = useNavigate();
	const restClient = useAdminRestClient();
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<ImageCache>>();
	const [searchInput, setSearchInput] = useState<string>('');
	const [paging, setPaging] = useState<PagingRequest>(DEFAULT_PAGING);

	const navigateToDetail = (s: ImageCache) => {
		navigate(`/admin/accounts/image-cache/detail/${s.id}`);
	};

	const load = useCallback(() => {
		restClient.imageCache
			.loadByAccount(accountId, paging)
			.then(setData)
			.catch((e: Error) => {
				setData(undefined);
				userAlerts.err(e);
			});
	}, [accountId, paging, restClient, userAlerts]);

	useEffect(load, [accountId, paging]);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			setPaging({...paging});
		},
		[paging, searchInput],
	);

	if (!data) return <TablePlaceholder/>;

	return (
		<div>
			<div className="pt-2 d-flex gap-2 align-items-center">
				<Button variant="primary" size="sm" onClick={() => navigate(`/admin/accounts/image-cache/detail/add/${accountId}`)}>
					+ Add
				</Button>
				<div style={{width: "250px"}}>
					<Form onSubmit={applySearch}>
						<TextInputWithReset
							value={searchInput}
							onChange={setSearchInput}
							onReset={() => {
								setSearchInput("");
								setPaging(DEFAULT_PAGING);
							}}
						/>
					</Form>
				</div>
				<Button onClick={applySearch} size="sm">Search</Button>
			</div>
			<div className="pt-2">
				<TableWithSelect
					showSelect={false}
					header={HEADER}
					paging={paging}
					totalItems={data.totalItems}
					onPagingChanged={setPaging}
					onClick={navigateToDetail}
					items={data.content}
					hover={true}
					striped={true}
				/>
			</div>
		</div>
	);
}
