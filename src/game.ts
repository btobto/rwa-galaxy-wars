import { BULLET_DEFAULT, CANVAS_HEIGHT, CANVAS_WIDTH, PLAYER_DEFAULT } from "./constants";
import { GameObject, Input, State } from "./interfaces";

export const getRandomIntInclusive = (min: number, max: number): number => (
	Math.floor(Math.random() * (max - min + 1) + min)
);

export const generateEnemy = (template: GameObject): GameObject => ({
	...template,
	x: getRandomIntInclusive(0, CANVAS_WIDTH - template.width),
	y: -template.height,
});

export const generateBullet = (ship: GameObject, shootsUp: boolean, color: string): GameObject => ({
	...BULLET_DEFAULT,
	x: ship.x + ship.width / 2 - BULLET_DEFAULT.width / 2,
	y: shootsUp ? ship.y : ship.y + ship.height,
	speed: ship.speed + 5,
	spriteOrColor: color,
});

const collision = (object1: GameObject, object2: GameObject): boolean => (
	object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
	object1.y < object2.y + object2.height && object1.y + object1.height > object2.y
);

const move = (
	object: GameObject, 
	distanceX: number, 
	distanceY: number,
	correctPosition: () => void
) => {
	object.x += distanceX;
	object.y += distanceY;
	correctPosition();
} 

const removeFromArray = (array: GameObject[], object: GameObject) => {
	const index = array.indexOf(object);
	array.splice(index, 1);
}

export const updateState = (state: State, input: Input): State => {
	for (const star of input.stars) {
		move(
			star, 0, star.speed,
			() => { if (star.y >= CANVAS_HEIGHT) star.y = 0; }
		);
	}

	let dx = 0;
	let dy = 0;

	if (input.keys.includes('ArrowLeft')) {
		dx -= state.player.speed;
	}
	if (input.keys.includes('ArrowRight')) {
		dx += state.player.speed;
	}
	if (input.keys.includes('ArrowUp')) {
		dy -= state.player.speed;
	}
	if (input.keys.includes('ArrowDown')) {
		dy += state.player.speed;
	}

	move(
		state.player, dx, dy,
		() => {
			if (state.player.x < 0) {
				state.player.x = 0;
			}
			else if (state.player.x + state.player.width >= CANVAS_WIDTH) {
				state.player.x = CANVAS_WIDTH - state.player.width;
			}

			if (state.player.y < 0) {
				state.player.y = 0;
			}
			else if (state.player.y + state.player.height >= CANVAS_HEIGHT) {
				state.player.y = CANVAS_HEIGHT - state.player.height;
			}
		}
	);

	for (const bullet of state.playerShots) {
		move (bullet, 0, -bullet.speed,
			() => {
				if (bullet.y <= 0) {
					const index = state.playerShots.indexOf(bullet);
					state.playerShots.splice(index, 1);
				}
			}
		);

		for (const enemy of state.enemies) {
			if (collision(bullet, enemy)) {
				const enemyIndex = state.enemies.indexOf(enemy);
				state.enemies.splice(enemyIndex, 1);			
				state.score += 1;

				const bulletIndex = state.playerShots.indexOf(bullet);
				state.playerShots.splice(bulletIndex, 1);
			};
		}

	}

	if (input.interval % 10 === 0 && input.keys.includes('Space')) {
		state.playerShots.push(
			generateBullet(state.player, true, 'green')
		);
	}

	for (const enemy of state.enemies) {
		move(enemy, 0, enemy.speed,
			() => {
				if (enemy.y >= CANVAS_HEIGHT) {
					const index = state.enemies.indexOf(enemy);
					state.enemies.splice(index, 1);			
				}
			}
		);

		if (collision(enemy, state.player)) {
			state.isGameOver = true;
		}

		if (
			input.interval % 10 === 0 &&
			getRandomIntInclusive(1, 10) === 1
			// input.interval === 5
		) {
			state.enemyShots.push(generateBullet(enemy, true, 'red'));
		}
	}

	for (const bullet of state.enemyShots) {
		move(bullet, 0, bullet.speed,
			() => {
				if (bullet.y >= CANVAS_HEIGHT) {
					const index = state.enemyShots.indexOf(bullet);
					state.enemyShots.splice(index, 1);
				}
			}
		);
	}

	return {
		player: state.player,
		enemies: input.enemies,
		score: state.score,
		isGameOver: state.isGameOver,
		stars: input.stars,	
		playerShots: state.playerShots,
		enemyShots: state.enemyShots
	}
};