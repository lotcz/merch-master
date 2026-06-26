import {createContext, useContext} from "react";
import {User} from "../types/User";

export class UserSession {
	theme: string = "dark";
	user?: User;
}

export const UserSessionContext = createContext(new UserSession());

export function useUserSession(): UserSession {
	return useContext(UserSessionContext);
}

export type UserSessionUpdate = (s: UserSession) => any;

export const UserSessionUpdateContext = createContext<UserSessionUpdate | undefined>(undefined);

export function useUserSessionUpdate(): UserSessionUpdate {
	const ctx = useContext(UserSessionUpdateContext);
	if (!ctx) throw new Error("useUserSessionUpdate must be used within App!");
	return ctx;
}

export function useLoggedUser(): User {
	const session = useUserSession();
	if (!session.user) throw new Error("useLoggedUser must be used within SecuredApp!");
	return session.user;
}
