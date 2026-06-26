import {NavigateFunction} from "react-router";
import {createContext, useContext} from "react";
import AdminNavigator from "./admin/AdminNavigator";

export default class OmAppNavigator {

	admin: AdminNavigator;

	constructor(navigate: NavigateFunction) {
		this.admin = new AdminNavigator(navigate);
	}

}

export const OmAppNavigatorContext = createContext<OmAppNavigator | undefined>(undefined);

export function useNavigator(): OmAppNavigator {
	const ctx = useContext(OmAppNavigatorContext);
	if (!ctx) throw new Error("useNavigator must be used within App!");
	return ctx;
}
