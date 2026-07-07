export type MoneyProps = {
	amount?: number | null;
};

export default function Money({amount}: MoneyProps) {
	if (!amount) return <></>

	return (
		<span>
			{amount} Kč
		</span>
	);
}
