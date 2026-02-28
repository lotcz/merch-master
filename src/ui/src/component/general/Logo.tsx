import {useMemo} from "react";
import {Img} from "../images/Img";

const SIZE_XS = 32;
const SIZE_SM = 64;
const SIZE_MD = 128;
const SIZE_LG = 256;

function getDimension(size?: string) {
	if (size === "xs") return SIZE_XS;
	if (size === "sm") return SIZE_SM;
	if (size === "lg") return SIZE_LG;
	return SIZE_MD;
}

export type LogoProps = {
	size?: "xs" | "sm" | "lg";
	maxWidth?: number;
	maxHeight?: number;
};

export default function Logo({size, maxHeight, maxWidth}: LogoProps) {
	const mw: number = useMemo(
		() => {
			if (maxWidth) return maxWidth;
			if (maxHeight) return maxHeight;
			return getDimension(size);
		},
		[maxWidth, maxHeight, size]
	);
	const mh: number = useMemo(
		() => {
			if (maxHeight) return maxHeight;
			if (maxWidth) return maxWidth;
			return getDimension(size);
		},
		[maxHeight, maxWidth, size]
	);
	const url: string = useMemo(
		() => {
			if (mw > SIZE_MD || mh > SIZE_MD) return "256x256"
			if (mw > SIZE_SM || mh > SIZE_SM) return "128x128"
			if (mw > SIZE_XS || mh > SIZE_XS) return "64x64"
			return "32x32";
		},
		[mh, mw]
	);
	return <Img url={`/img/logo${url}.png`} maxWidth={mw} maxHeight={mh} alt="logo"/>
}

