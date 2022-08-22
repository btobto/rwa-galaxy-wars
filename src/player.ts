export class Player {
	constructor(
		public x: number,
		public y: number,
	) {}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = 'yellow';
		ctx.fillStyle = 'black';
		ctx.strokeRect(this.x, this.y, 50, 50);
		ctx.fillRect(this.x, this.y, 50, 50);
	}

	move(keys: string[]) {
		if (keys.includes('ArrowLeft')) {
			this.x -= 5;
		}

		if (keys.includes('ArrowRight')) {
			this.x += 5;
		}

		if (keys.includes('ArrowUp')) {
			this.y -= 5;
		}

		if (keys.includes('ArrowDown')) {
			this.y += 5;
		}
	}
}