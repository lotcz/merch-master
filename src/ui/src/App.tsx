import {lazy, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Route, Routes, useNavigate} from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shared/style/general.less";
import "./shared/style/index.css";
import "./shared/style/responsive.css";
import SuspensePage from "./shared/component/LoadingPage";
import OmAppNavigator, {OmAppNavigatorContext} from "./shared/navigator/OmAppNavigator";
import {ConfirmDialog, ConfirmDialogContext, ConfirmDialogContextData, ConfirmDialogProps, UserAlertsWidget} from "zavadil-react-common";
import WaitingDialog, {WaitingDialogProps} from "./shared/component/general/WaitingDialog";
import {WaitingDialogContext, WaitingDialogContextContent} from "./shared/util/WaitingDialogContext";
import {UserSession, UserSessionContext, UserSessionUpdateContext} from "./shared/util/UserSession";
import {UserAlertsContext} from "./shared/util/UserAlerts";
import AdminApp from "./secured/admin/AdminApp";
import CreatorApp from "./secured/creator/component/CreatorApp";

const SecuredApp = lazy(() => import("./secured/SecuredApp"));
const PublicApp = lazy(() => import("./public/PublicApp"));

export default function App() {
	const navigate = useNavigate();
	const navigator = useMemo(() => new OmAppNavigator(navigate), [navigate]);

	const userAlerts = useContext(UserAlertsContext);
	const [showAlerts, setShowAlerts] = useState<boolean>();

	const [session, setSession] = useState<UserSession>(new UserSession());

	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();

	const alertsChanged = useCallback(() => {
		setShowAlerts(userAlerts.alerts.length > 0);
	}, [userAlerts]);

	const updateSessionValues = useCallback((s: UserSession) => {
		//document.documentElement.dataset.bsTheme = s.theme;
	}, []);

	const saveSession = useCallback(
		(s: UserSession) => {
			updateSessionValues(s);
			localStorage.setItem("open-merch-session", JSON.stringify(s));
			setSession({...s});
		},
		[updateSessionValues],
	);

	const loadSession = useCallback(() => {
		const json = localStorage.getItem("open-merch-session");
		if (json) {
			const session = JSON.parse(json);
			setSession(session);
			updateSessionValues(session);
		}
	}, [updateSessionValues]);

	const confirmDialogContext = useMemo<ConfirmDialogContextData>(() => new ConfirmDialogContextData(setConfirmDialog), []);

	const waitingDialogContext = useMemo<WaitingDialogContextContent>(() => {
		return {
			show: (text, onCancel) => {
				setWaitingDialog({text: text, onCancel: onCancel, onClose: () => (onCancel ? onCancel() : null)});
			},
			progress: (progress?: number, max?: number) => {
				if (!waitingDialog) return;
				waitingDialog.progress = progress;
				waitingDialog.max = max;
				setWaitingDialog({...waitingDialog});
			},
			hide: () => {
				setWaitingDialog(undefined);
			},
		};
	}, [waitingDialog]);

	useEffect(() => {
		userAlerts.addOnChangeHandler(alertsChanged);

		// session
		loadSession();

		return () => {
			userAlerts.removeOnChangeHandler(alertsChanged);
		};
	}, []);

	return (
		<OmAppNavigatorContext.Provider value={navigator}>
			<UserSessionContext.Provider value={session}>
				<UserSessionUpdateContext.Provider value={saveSession}>
					<ConfirmDialogContext.Provider value={confirmDialogContext}>
						<WaitingDialogContext.Provider value={waitingDialogContext}>
							<Routes>
								<Route
									path="/admin/*"
									element={
										<SuspensePage>
											<SecuredApp><AdminApp/></SecuredApp>
										</SuspensePage>
									}
								/>
								<Route
									path="/creator/*"
									element={
										<SuspensePage>
											<SecuredApp><CreatorApp/></SecuredApp>
										</SuspensePage>
									}
								/>
								<Route
									path="*"
									element={
										<SuspensePage>
											<PublicApp/>
										</SuspensePage>
									}
								/>
							</Routes>
							{confirmDialog && <ConfirmDialog {...confirmDialog} />}
							{waitingDialog && <WaitingDialog {...waitingDialog} />}
							{showAlerts && <UserAlertsWidget userAlerts={userAlerts}/>}
						</WaitingDialogContext.Provider>
					</ConfirmDialogContext.Provider>
				</UserSessionUpdateContext.Provider>
			</UserSessionContext.Provider>
		</OmAppNavigatorContext.Provider>
	);
}
