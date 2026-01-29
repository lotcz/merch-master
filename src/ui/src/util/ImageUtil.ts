export const PIXEL_PER_CM = 100;

export default class ImageUtil {

	static getMaxScale(
		imgWidth: number,
		imgHeight: number,
		maxWidth: number,
		maxHeight: number
	) {
		const wScale = Math.min(maxWidth / imgWidth, 1);
		const hScale = Math.min(maxHeight / imgHeight, 1);
		return Math.min(wScale, hScale);
	}

}
