export type CylinderEffectParams = {
	imageUrl: string;
	width: number;
	height: number;
	verticalAngle: number
}

export default function CylinderEffect(
	{
		imageUrl,
		width,
		height,
		verticalAngle
	}: CylinderEffectParams
) {
	const slices = 20; // More slices = smoother curve
	const sliceWidth = 10; // Width in pixels
	const radius = 60; // How "deep" the cylinder is

	return (
		<div
			className="cylinder-effect"
			style={
				{
					position: 'relative',
					width: width,
					height: height,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'start',
				}
			}
		>
			<div
				style={
					{
						position: 'relative',
						perspective: '1000px',
						transformStyle: 'preserve-3d',
						transform: `rotateX(${verticalAngle}deg)`
					}
				}
			>
				{[...Array(slices)].map((_, i) => {
					const angle = (i / slices) * 180 - 90; // Arc from -90 to 90 degrees
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								width: `${sliceWidth}px`,
								height: height,
								backgroundImage: `url(${imageUrl})`,
								backgroundSize: `${slices * sliceWidth}px 100%`,
								backgroundPosition: `-${i * sliceWidth}px 0`,
								// The "Magic": Rotate and push forward
								transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
								backfaceVisibility: 'hidden',
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
