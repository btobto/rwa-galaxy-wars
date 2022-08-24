import { BULLET_DEFAULT, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
import { GameObject, Input, State } from "./interfaces";

export const getRandomIntInclusive = (min: number, max: number): number => (
	Math.floor(Math.random() * (max - min + 1) + min)
);

const move = (
	object: GameObject, 
	distanceX: number, 
	distanceY: number,
	correctPosition: Function
) => {
	object.x += distanceX;
	object.y += distanceY;
	correctPosition();
} 

export const updateState = (state: State, input: Input): State => {
	input.stars.forEach((star: GameObject) => {
		move(
			star, 0, star.speed,
			() => { if (star.y >= CANVAS_HEIGHT) star.y = 0; }
		);
	});

	let dx = 0;
	let dy = 0;
	if (input.keys.includes('ArrowLeft')) {
		dx -= 5;
	}
	if (input.keys.includes('ArrowRight')) {
		dx += 5;
	}
	if (input.keys.includes('ArrowUp')) {
		dy -= 5;
	}
	if (input.keys.includes('ArrowDown')) {
		dy += 5;
	}
	move(
		state.player, dx, dy,
		() => {
			if (state.player.x < 0) state.player.x = 0;
			else if (state.player.x + state.player.width >= CANVAS_WIDTH) state.player.x = CANVAS_WIDTH - state.player.width;
			if (state.player.y < 0) state.player.y = 0;
			else if (state.player.y + state.player.height >= CANVAS_HEIGHT) state.player.y = CANVAS_HEIGHT - state.player.height;
		}
	);

	state.enemies.forEach(enemy => {
		move(
			enemy, 
			0, // getRandomIntInclusive(-2, +2) 
			enemy.speed,
			() => {
				if (enemy.y >= CANVAS_HEIGHT) {
					const index = state.enemies.indexOf(enemy);
					state.enemies.splice(index, 1);			
				}
			}
			);
	});

	state.playerBullets.forEach(bullet => {
		move (bullet, 0, -bullet.speed,
			() => {
				if (bullet.y <= 0) {
					const index = state.playerBullets.indexOf(bullet);
					state.playerBullets.splice(index, 1);
				}
			}
		);
	});

	if (input.interval % 10 === 0 && input.keys.includes('Space')) {
		state.playerBullets.push({
			...BULLET_DEFAULT,
			x: state.player.x + state.player.width / 2 - BULLET_DEFAULT.width / 2,
			y: state.player.y,
			speed: state.player.speed + 2,
		});
	}

	return {
		player: state.player,
		enemies: input.enemies,
		playerBullets: state.playerBullets,
		enemyBullets: state.enemyBullets,
		score: 0,
		isGameOver: false,
		stars: input.stars,	
	}
};