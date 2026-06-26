import {PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Localize, Spread,} from "zavadil-react-common";
import {Spinner} from "react-bootstrap";
import OmSecuredRestClient, {SecuredRestClientContext} from "../shared/client/OmSecuredRestClient";
import {UploadImageModal, UploadImageModalProps} from "../shared/component/images/UploadImageModal";
import {UserAlertsContext} from "../shared/util/UserAlerts";
import {useUserSession, useUserSessionUpdate} from "../shared/util/UserSession";
import {ObjectUtil} from "zavadil-ts-common";
import {User} from "../shared/types/User";
import {UploadImageDialogContext, UploadImageDialogContextContent} from "../shared/util/UploadImageDialogContext";
import {LoginPage} from "./LoginPage";

export default function SecuredApp({children}: PropsWithChildren) {
	const userAlerts = useContext(UserAlertsContext);
	const userSession = useUserSession();
	const userSessionUpdate = useUserSessionUpdate();
	const isLoggedIn = useMemo<boolean>(() => ObjectUtil.notEmpty(userSession.user), [userSession]);
	const [isInitializing, setIsInitializing] = useState<boolean>(false);
	const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
	const [lastLogin, setLastLogin] = useState<string>();
	const [uploadImageDialog, setUploadImageDialog] = useState<UploadImageModalProps>();

	const setUser = useCallback((user?: User) => {
		userSession.user = user;
		userSessionUpdate(userSession);
	}, [userSession, userSessionUpdate]);

	const securedRestClient = useMemo(() => new OmSecuredRestClient(() => setUser()), [setUser]);

	// initialize
	useEffect(
		() => {
			setIsInitializing(true);
			securedRestClient
				.initialize()
				.then((at) => securedRestClient.profile())
				.then((u) => setUser(u))
				.catch((e) => {
					userAlerts.err(`Rest initialization failed: ${e}`);
					setUser();
				})
				.finally(() => {
					setIsInitializing(false);
				});
		},
		[]
	);

	const logIn = useCallback(
		(login: string, password: string) => {
			setIsLoggingIn(true);
			setLastLogin(login);
			securedRestClient.logIn(login, password)
				.then((at) => securedRestClient.profile())
				.then((u) => setUser(u))
				.catch((e) => {
					let message = 'Přihlášení selhalo';
					if (e instanceof Error) {
						message += `: ${e.message}`;
					} else if (typeof e === 'string') {
						message += `: ${e}`;
					}
					userAlerts.err(message);
				})
				.finally(() => setIsLoggingIn(false));
		},
		[securedRestClient, userAlerts, setUser]
	);

	const uploadImageDialogContext = useMemo<UploadImageDialogContextContent>(() => {
		return {
			show: (props: UploadImageModalProps) => setUploadImageDialog(props),
			hide: () => setUploadImageDialog(undefined),
		};
	}, []);

	return (
		<SecuredRestClientContext.Provider value={securedRestClient}>
			<UploadImageDialogContext.Provider value={uploadImageDialogContext}>
				<div className="min-h-100 d-flex flex-column align-items-stretch">
					{
						(isInitializing || isLoggingIn) ? (
							<Spread>
								<div className="d-flex flex-column align-items-center">
									<div>
										<Spinner/>
									</div>
									<div>
										<Localize text={isLoggingIn ? 'Logging in' : 'Initializing'}/>
									</div>
								</div>
							</Spread>
						) : (
							isLoggedIn ? <div>
								{children}
								{uploadImageDialog && <UploadImageModal {...uploadImageDialog} />}
							</div> : <LoginPage onConfirmed={logIn} lastLogin={lastLogin}/>
						)
					}
				</div>
			</UploadImageDialogContext.Provider>
		</SecuredRestClientContext.Provider>
	);
}
