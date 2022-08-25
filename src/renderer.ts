import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameObject, Particle, Ship, State } from "./interfaces";

const drawGameObject = (ctx: CanvasRenderingContext2D, object: GameObject) => {
	if ('color' in object) {
		ctx.fillStyle = (<Particle>object).color;
		ctx.fillRect(object.x, object.y, object.width, object.height);
	} else if ('sprite' in object) {
		ctx.drawImage((<Ship>object).sprite, object.x, object.y, object.width, object.height);
	}
}

export const draw = (
	ctx: CanvasRenderingContext2D,
	scoreContainer: HTMLElement,
	state: State,
) => {
	if (state.isGameOver) {
		scoreContainer.innerHTML = `GAME OVER. Score: ${state.score}`;
		return;
	} else {
		scoreContainer.innerHTML = `Score: ${state.score}`;
	}

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	state.stars.forEach((star: GameObject) => {
		drawGameObject(ctx, star);
	});

	state.enemies.forEach(enemy => {
		drawGameObject(ctx, enemy);

		enemy.shots.forEach(bullet => {
			drawGameObject(ctx, bullet);
		})
	});

	state.player.shots.forEach(bullet => {
		drawGameObject(ctx, bullet);
	})


	drawGameObject(ctx, state.player);
}