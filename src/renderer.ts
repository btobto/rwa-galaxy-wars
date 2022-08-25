import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameObject, State } from "./interfaces";

const drawGameObject = (ctx: CanvasRenderingContext2D, object: GameObject) => {
	if (typeof object.spriteOrColor === 'string') {
		ctx.fillStyle = object.spriteOrColor;
		ctx.fillRect(object.x, object.y, object.width, object.height);
	} else {
		ctx.drawImage(object.spriteOrColor, object.x, object.y, object.width, object.height);
	}
}

export const draw = (
	ctx: CanvasRenderingContext2D,
	scoreContainer: HTMLElement,
	state: State,
) => {
	if (state.gameOver) {
		scoreContainer.innerHTML = `GAME OVER. Score: ${state.score}`;
		return;
	} else {
		scoreContainer.innerHTML = `Score: ${state.score}`;
	}

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	for (const object of state.stars.concat(state.enemies, state.playerShots, state.enemyShots, state.player)) {
		drawGameObject(ctx, object);
	}
}