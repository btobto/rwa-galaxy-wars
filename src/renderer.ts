import { Player } from "./player";

export class Renderer {
	constructor(
		private canvas: HTMLCanvasElement,
		private ctx: CanvasRenderingContext2D
	) {}

	draw(player: Player) {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
		player.draw(this.ctx);	
	}
}