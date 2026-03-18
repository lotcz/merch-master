import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import {UserAlertsContext} from "../../shared/util/UserAlerts";
import {UserSession, UserSessionContext, UserSessionUpdateContext} from "../../shared/util/UserSession";
import {
	ConfirmDialog,
	ConfirmDialogContext,
	ConfirmDialogContextData,
	ConfirmDialogProps,
	IconButton,
	Localize,
	Spread,
	UserAlertsWidget,
} from "zavadil-react-common";
import {Spinner} from "react-bootstrap";
import {WaitingDialogContext, WaitingDialogContextContent} from "../../shared/util/WaitingDialogContext";
import WaitingDialog, {WaitingDialogProps} from "../../shared/component/general/WaitingDialog";
import {BsRepeat} from "react-icons/bs";
import {UploadImageModal, UploadImageModalProps} from "../../shared/component/images/UploadImageModal";
import {UploadImageDialogContext, UploadImageDialogContextContent} from "../../shared/util/UploadImageDialogContext";
import {AdminRestClient, AdminRestClientContext} from "../client/AdminRestClient";
import {useNavigate} from "react-router";
import AdminNavigator, {AdminNavigatorContext} from "../navigator/AdminNavigator";

export default function AdminApp() {
	const userAlerts = useContext(UserAlertsContext);
	const navigate = useNavigate();
	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>();
	const [waitingDialog, setWaitingDialog] = useState<WaitingDialogProps>();
	const [uploadImageDialog, setUploadImageDialog] = useState<UploadImageModalProps>();
	const [session, setSession] = useState<UserSession>(new UserSession());
	const [initialized, setInitialized] = useState<boolean>();
	const [showAlerts, setShowAlerts] = useState<boolean>();

	const restClient = useMemo(() => new AdminRestClient(true), []);

	const navigator = useMemo(() => new AdminNavigator(navigate), [navigate]);

	const updateSessionValues = useCallback((s: UserSession) => {
		document.documentElement.dataset.bsTheme = s.theme;
	}, []);

	const saveSession = useCallback(
		(s: UserSession) => {
			updateSessionValues(s);
			localStorage.setItem("merchmaster-session", JSON.stringify(s));
			setSession({...s});
		},
		[updateSessionValues],
	);

	const loadSession = useCallback(() => {
		const json = localStorage.getItem("merchmaster-session");
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

	const uploadImageDialogContext = useMemo<UploadImageDialogContextContent>(() => {
		return {
			show: (props: UploadImageModalProps) => setUploadImageDialog(props),
			hide: () => setUploadImageDialog(undefined),
		};
	}, []);

	const restInitialize = useCallback(() => {
		setInitialized(undefined);
		try {
			restClient
				.initialize()
				.then(() => setInitialized(true))
				.catch((e) => {
					userAlerts.err(`Rest initialization failed: ${e}`);
					setInitialized(false);
				});
		} catch (e: any) {
			userAlerts.err(`Rest initialization failed: ${e}`);
			setInitialized(false);
		}
	}, [restClient, userAlerts]);

	const alertsChanged = useCallback(() => {
		setShowAlerts(userAlerts.alerts.length > 0);
	}, [userAlerts]);

	useEffect(() => {
		userAlerts.addOnChangeHandler(alertsChanged);

		// session
		loadSession();

		// rest client
		restInitialize();

		return () => {
			userAlerts.removeOnChangeHandler(alertsChanged);
		};
	}, []);

	return (
		<AdminRestClientContext.Provider value={restClient}>
			<AdminNavigatorContext.Provider value={navigator}>
				<UserSessionContext.Provider value={session}>
					<UserSessionUpdateContext.Provider value={saveSession}>
						<UploadImageDialogContext.Provider value={uploadImageDialogContext}>
							<WaitingDialogContext.Provider value={waitingDialogContext}>
								<ConfirmDialogContext.Provider value={confirmDialogContext}>
									<div className="min-h-100 d-flex flex-column align-items-stretch">
										{initialized === undefined && (
											<Spread>
												<div className="d-flex flex-column align-items-center">
													<div>
														<Spinner/>
													</div>
													<div>
														<Localize text="Initializing"/>
													</div>
												</div>
											</Spread>
										)}
										{initialized === false && (
											<Spread>
												<div className="d-flex flex-column align-items-center">
													<div className="p-3">
														<Localize text="Initialization failed!"/>
													</div>
													<div>
														<IconButton onClick={restInitialize} icon={<BsRepeat/>}>
															<Localize text="Try again"/>
														</IconButton>
													</div>
												</div>
											</Spread>
										)}
										{initialized === true && (
											<>
												<Header/>
												<Main/>
												<Footer/>
											</>
										)}
										{confirmDialog && <ConfirmDialog {...confirmDialog} />}
										{waitingDialog && <WaitingDialog {...waitingDialog} />}
										{uploadImageDialog && <UploadImageModal {...uploadImageDialog} />}
										{showAlerts && <UserAlertsWidget userAlerts={userAlerts}/>}
									</div>
								</ConfirmDialogContext.Provider>
							</WaitingDialogContext.Provider>
						</UploadImageDialogContext.Provider>
					</UserSessionUpdateContext.Provider>
				</UserSessionContext.Provider>
			</AdminNavigatorContext.Provider>
		</AdminRestClientContext.Provider>
	);
}
