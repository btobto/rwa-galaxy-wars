import { getRandomIntInclusive } from "./game";

export class Enemy {
	constructor(
		public x: number,
		public y: number,
		public sprite: HTMLImageElement,
	) {}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(this.sprite, this.x, this.y, 50, 64);
	}

	move() {
		this.y += 5;
		// this.x += getRandomIntInclusive(-2, +2);
	}
}