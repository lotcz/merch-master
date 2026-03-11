import {FormEvent, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Button, Form, Stack} from "react-bootstrap";
import {DateTime, SelectableTableHeader, TablePlaceholder, TableWithSelect, TextInputWithReset} from "zavadil-react-common";
import {ObjectUtil, Page, PagingRequest, PagingUtil, StringUtil} from "zavadil-ts-common";
import {useNavigate, useParams} from "react-router";
import {AdminRestClientContext} from "../../client/AdminRestClient";
import {UserAlertsContext} from "../../../shared/util/UserAlerts";
import RefreshIconButton from "../../../shared/component/general/RefreshIconButton";
import {User} from "../../../shared/types/User";

const HEADER: SelectableTableHeader<User> = [
	{name: "id", label: "ID"},
	{name: "account.name", label: "Account"},
	{name: "name", label: "Name"},
	{name: "email", label: "Email"},
	{name: "state", label: "State"},
	{name: "lastUpdatedOn", label: "Updated", renderer: (p) => <DateTime value={p.lastUpdatedOn}/>},
	{name: "createdOn", label: "Created", renderer: (p) => <DateTime value={p.createdOn}/>},
	{name: "syncState", label: "Sync"},
];

const DEFAULT_PAGING: PagingRequest = {page: 0, size: 100, sorting: [{name: "lastUpdatedOn", desc: true}]};

export default function UsersList() {
	const {pagingString} = useParams();
	const navigate = useNavigate();
	const restClient = useContext(AdminRestClientContext);
	const userAlerts = useContext(UserAlertsContext);
	const [data, setData] = useState<Page<User> | null>(null);

	const paging = useMemo(
		() => (StringUtil.isBlank(pagingString) ? ObjectUtil.clone(DEFAULT_PAGING) : PagingUtil.pagingRequestFromString(pagingString)),
		[pagingString],
	);

	const [searchInput, setSearchInput] = useState<string>(StringUtil.getNonEmpty(paging.search));

	const navigateToPage = useCallback(
		(p?: PagingRequest) => {
			navigate(`/admin/users/${PagingUtil.pagingRequestToString(p)}`);
		},
		[navigate],
	);

	const navigateToId = useCallback(
		(id: number) => {
			navigate(`/admin/users/detail/${id}`);
		},
		[navigate],
	);

	const navigateToDetail = useCallback(
		(p: User) => {
			if (p.id) navigateToId(p.id);
		},
		[navigateToId],
	);

	const applySearch = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			paging.search = searchInput;
			paging.page = 0;
			navigateToPage(paging);
		},
		[paging, searchInput, navigateToPage],
	);

	const loadPageHandler = useCallback(() => {
		setData(null);
		restClient.users
			.loadPage(paging)
			.then(setData)
			.catch((e: Error) => {
				setData(null);
				userAlerts.err(e);
			});
	}, [paging, restClient, userAlerts]);

	useEffect(loadPageHandler, [paging]);

	const reload = useCallback(() => {
		setData(null);
		loadPageHandler();
	}, [loadPageHandler]);

	return (
		<div>
			<div className="pt-2 ps-3">
				<Stack direction="horizontal" gap={2}>
					<RefreshIconButton onClick={reload}/>
					<div style={{width: "250px"}}>
						<Form onSubmit={applySearch}>
							<TextInputWithReset
								value={searchInput}
								onChange={setSearchInput}
								onReset={() => {
									setSearchInput("");
									navigateToPage(DEFAULT_PAGING);
								}}
							/>
						</Form>
					</div>
					<Button onClick={applySearch}>Search</Button>
				</Stack>
			</div>

			<div className="px-3 gap-3">
				{data === null ? (
					<TablePlaceholder/>
				) : (
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
				)}
			</div>
		</div>
	);
}
