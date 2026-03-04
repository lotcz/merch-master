import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, Form, Button } from "react-bootstrap";
import { FormRow, LoadingButton, Localize, UserAlertWidget } from "zavadil-react-common";
import { RefreshTokenPayload, StringUtil, UserAlertType } from "zavadil-ts-common";
import BrandLogoText from "../../shared/component/brand/BrandLogoText";
import { useCreatorRestClient } from "../client/CreatorRestClient";
import { BsCheck } from "react-icons/bs";

export type RefreshTokenSetter = (token: RefreshTokenPayload) => any;

export type LoginFormProps = {
	onRefreshTokenObtained: RefreshTokenSetter;
};

export default function LoginPage({ onRefreshTokenObtained }: LoginFormProps) {
	const restClient = useCreatorRestClient();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>();
	const [processing, setProcessing] = useState<boolean>(false);

	useEffect(() => {
		restClient.reset();
	}, []);

	const logIn = useCallback(
		(e: FormEvent) => {
			console.log("submitting");
			e.stopPropagation();
			e.preventDefault();
			setProcessing(true);
			setError(undefined);
			restClient
				.login(email, password)
				.then(onRefreshTokenObtained)
				.catch((e) => {
					setError(StringUtil.toString(e));
				})
				.finally(() => setProcessing(false));
		},
		[restClient, email, password, onRefreshTokenObtained],
	);

	return (
		<div className="login-page min-h-100 d-flex flex-column align-items-center justify-content-center">
			<Card>
				<Card.Body>
					<div className="d-flex flex-column align-items-center justify-content-center gap-4">
						<BrandLogoText size="sm" />
						<Form className="login-form" onSubmit={logIn}>
							<FormRow label="Email">
								<Form.Control
									type="text"
									disabled={processing}
									required={true}
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
							</FormRow>
							<FormRow label="Password">
								<Form.Control
									type="password"
									disabled={processing}
									required={true}
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
							</FormRow>
							{error && <div className="error small">{error}</div>}
							<div className="d-flex justify-content-center mt-3">
								<LoadingButton type="submit" variant="brand" icon={<BsCheck />} loading={processing}>
									<Localize text="Sign in" />
								</LoadingButton>
							</div>
							<div className="d-flex justify-content-around mt-3">
								<Link to="/public/forgotten-password">
									<Localize text="Reset password" />
								</Link>
								<Link to="/public/register">
									<Localize text="Register" />
								</Link>
							</div>
						</Form>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
}
