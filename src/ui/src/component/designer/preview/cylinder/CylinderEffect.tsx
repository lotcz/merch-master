import {useMemo} from "react";

export type CylinderEffectParams = {
	imageUrl: string;
	width: number;
	height: number;
	verticalAngle?: number;
	perspective?: number;
	slices?: number;
	radius?: number;
	startAngle?: number;
	endAngle?: number;
}

export default function CylinderEffect({
	imageUrl,
	width,
	height,
	verticalAngle = -10,
	perspective = -10,
	slices = 10,
	radius = 60,
	startAngle = -75,
	endAngle = 75
}: CylinderEffectParams) {
	const totalAngle = useMemo(() => endAngle - startAngle, [startAngle, endAngle]);
	const sliceAngle = useMemo(() => totalAngle / slices, [slices, totalAngle]);
	const sliceWidth = useMemo(
		() => {
			const alpha = (sliceAngle / 2) * (Math.PI / 180);
			const sliceLength = 2 * radius * Math.tan(alpha);
			return Math.ceil(sliceLength);
		},
		[radius, sliceAngle]
	);
	const angles: Array<number> = useMemo(
		(): Array<number> => {
			const offset = sliceAngle / 2;
			const a = [];
			for (let i = 0, max = slices; i < max; i++) {
				a.push(startAngle + (i * sliceAngle) + offset);
			}
			return a;
		},
		[slices, startAngle, sliceAngle]
	);

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
					alignItems: 'start'
				}
			}
		>
			<div
				style={
					{
						position: 'relative',
						perspective: `${perspective}px`,
						transformStyle: 'preserve-3d',
						transform: `rotateX(${verticalAngle}deg)`
					}
				}
			>
				{
					angles.map(
						(angle, i) => <div
							key={i}
							style={{
								position: 'absolute',
								width: `${sliceWidth}px`,
								height: height,
								backgroundImage: `url(${imageUrl})`,
								backgroundSize: `${slices * sliceWidth}px 100%`,
								backgroundPosition: `-${i * sliceWidth}px 0`,
								transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
								backfaceVisibility: 'hidden',
							}}
						/>
					)
				}
			</div>
		</div>
	);
};
