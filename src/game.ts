import { BULLET_DEFAULT, CANVAS_HEIGHT, CANVAS_WIDTH, PLAYER_DEFAULT } from "./constants";
import { GameObject, Input, Particle, Ship, State } from "./interfaces";

export const getRandomIntInclusive = (min: number, max: number): number => (
	Math.floor(Math.random() * (max - min + 1) + min)
);

export const generateEnemy = (template: Ship): Ship => ({
	...template,
	x: getRandomIntInclusive(0, CANVAS_WIDTH - template.width),
	y: -template.height,
});

export const generateBullet = (ship: Ship, shootsUp: boolean, color: string): Particle => ({
	...BULLET_DEFAULT,
	x: ship.x + ship.width / 2 - BULLET_DEFAULT.width / 2,
	y: shootsUp ? ship.y : ship.y + ship.height,
	speed: ship.speed + 2,
	color: color,
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
	input.stars.forEach((star: GameObject) => {
		move(
			star, 0, star.speed,
			() => { if (star.y >= CANVAS_HEIGHT) star.y = 0; }
		);
	});

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

	state.player.shots.forEach(bullet => {
		move (bullet, 0, -bullet.speed,
			() => {
				if (bullet.y <= 0) {
					const index = state.player.shots.indexOf(bullet);
					state.player.shots.splice(index, 1);
				}
			}
		);

		state.enemies.forEach(enemy => {
			if (collision(bullet, enemy)) {
				const enemyIndex = state.enemies.indexOf(enemy);
				state.enemies.splice(enemyIndex, 1);			
				state.score += 1;

				const bulletIndex = state.player.shots.indexOf(bullet);
				state.player.shots.splice(bulletIndex, 1);
			};

		})
	});

	if (input.interval % 10 === 0 && input.keys.includes('Space')) {
		state.player.shots.push(
			generateBullet(state.player, true, 'green')
		);
	}

	state.enemies.forEach((enemy, index) => {
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
		
		// console.log('e ' + enemy.speed);
		// console.log('enemy ' + index + ' bullets ', enemy.shots);
		enemy.shots.forEach(bullet => {
		// console.log('b ' + bullet.speed);
			move(bullet, 0, bullet.speed,
				() => {
					if (bullet.y >= CANVAS_HEIGHT) {
						const index = enemy.shots.indexOf(bullet);
						enemy.shots.splice(index, 1);
					}
				}
			);
		})
	});


	return {
		player: state.player,
		enemies: input.enemies,
		score: state.score,
		isGameOver: state.isGameOver,
		stars: input.stars,	
	}
};