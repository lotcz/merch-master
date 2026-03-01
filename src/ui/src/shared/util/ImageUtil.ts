export const PIXEL_PER_MM = 10;
export const DESIGNER_MAX_WIDTH = 800;
export const DESIGNER_MAX_HEIGHT = 350;

export type Color = {
	r: number;
	g: number;
	b: number;
}

export default class ImageUtil {

	static imageFitScale(
		imgWidth: number,
		imgHeight: number,
		maxWidth: number,
		maxHeight: number
	): number {
		const wScale = Math.min(maxWidth / imgWidth, 1);
		const hScale = Math.min(maxHeight / imgHeight, 1);
		return Math.min(wScale, hScale);
	}

	static imageFillScale(
		imgWidth: number,
		imgHeight: number,
		maxWidth: number,
		maxHeight: number
	): number {
		const wScale = Math.min(maxWidth / imgWidth, 1);
		const hScale = Math.min(maxHeight / imgHeight, 1);
		return Math.max(wScale, hScale);
	}

	static imageGetScale(
		imgWidth: number,
		imgHeight: number,
		maxWidth: number,
		maxHeight: number
	): number {
		const wScale = maxWidth / imgWidth;
		const hScale = maxHeight / imgHeight;
		return Math.max(wScale, hScale);
	}

	static snap(size: number): number {
		return Math.ceil(size / 100) * 100;
	}

	static hexToColor(hex?: string | null): Color | undefined {
		if (!hex) return undefined;
		if (hex.length < 7) return undefined;
		return {
			r: parseInt(hex.slice(1, 3), 16),
			g: parseInt(hex.slice(3, 5), 16),
			b: parseInt(hex.slice(5, 7), 16)
		}
	}

	static removeBackgroundCanvas(target: HTMLCanvasElement, img: HTMLImageElement, color: Color, threshold: number) {
		const ctx = target.getContext('2d');
		if (!ctx) {
			console.log('Failed to create context when removing the background.')
			return;
		}
		target.width = img.width;
		target.height = img.height;
		ctx.drawImage(img, 0, 0);
		const imageData = ctx.getImageData(0, 0, img.width, img.height);
		const data = imageData.data;

		for (let i = 0; i < data.length; i += 4) {
			const rDiff = data[i] - color.r;
			const gDiff = data[i + 1] - color.g;
			const bDiff = data[i + 2] - color.b;

			// Euclidean distance for color similarity
			const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);

			if (distance < threshold) {
				data[i + 3] = 0; // Alpha channel to transparent
			}
		}

		ctx.clearRect(0, 0, img.width, img.height);
		ctx.putImageData(imageData, 0, 0);
	}

	static removeBackground(img: HTMLImageElement, color: Color, threshold: number): HTMLCanvasElement | undefined {
		const cnv = document.createElement('canvas');
		this.removeBackgroundCanvas(cnv, img, color, threshold);
		return cnv;
	}

}
