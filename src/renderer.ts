import { Enemy } from "./enemy";
import { Star } from "./interfaces";
import { Player } from "./player";

export class Renderer {
	constructor(
		private canvas: HTMLCanvasElement,
		private ctx: CanvasRenderingContext2D
	) {}

	draw(player: Player, stars: Star[], enemies: Enemy[]) {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = 'white';
		stars.forEach((star: Star) => {
			this.ctx.fillRect(star.x, star.y, star.size, star.size);
		});

		enemies.forEach(enemy => enemy.draw(this.ctx));
	
		player.draw(this.ctx);	
	}
}