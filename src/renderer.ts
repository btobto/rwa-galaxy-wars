import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameObject, State } from "./interfaces";

export const draw = (
	ctx: CanvasRenderingContext2D,
	scoreContainer: HTMLElement,
	state: State,
) => {
	// canvas bg
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// stars
	ctx.fillStyle = 'white';
	state.stars.forEach((star: GameObject) => {
		ctx.fillRect(star.x, star.y, star.width, star.height);
	});

	// enemies
	state.enemies.forEach(enemy => {
		ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.width, enemy.height);
	});

	// player bullets
	ctx.fillStyle = 'green';
	state.playerBullets.forEach(bullet => {
		ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
	})

	// player
	ctx.drawImage(state.player.sprite, state.player.x, state.player.y, state.player.width, state.player.height);
}