import { BULLET_DEFAULT, CANVAS_HEIGHT, CANVAS_WIDTH, PLAYER_DEFAULT } from "./constants";
import { GameObject, Input, State } from "./interfaces";

export const getRandomIntInclusive = (min: number, max: number): number => (
	Math.floor(Math.random() * (max - min + 1) + min)
)

export const generateEnemy = (template: GameObject): GameObject => ({
	...template,
	x: getRandomIntInclusive(0, CANVAS_WIDTH - template.width),
	y: -template.height,
})

export const generateBullet = (ship: GameObject, shootsUp: boolean, color: string): GameObject => ({
	...BULLET_DEFAULT,
	x: ship.x + ship.width / 2 - BULLET_DEFAULT.width / 2,
	y: shootsUp ? ship.y : ship.y + ship.height,
	speed: ship.speed + 5,
	spriteOrColor: color,
})

const collision = (object1: GameObject, object2: GameObject): boolean => (
	object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
	object1.y < object2.y + object2.height && object1.y + object1.height > object2.y
)

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

const calculateScore = (oldScore: number, playerShots: GameObject[], enemies: GameObject[]): number => {
	let newPoints = 0;
	for(const bullet of playerShots) {
		for (const enemy of enemies) {
			if (collision(bullet, enemy)) {			
				removeFromArray(enemies, enemy);
				removeFromArray(playerShots, bullet);
				newPoints += 1;
			};
		}
	}
	return oldScore + newPoints;
}

const gameOver = (player: GameObject, enemies: GameObject[], enemyShots: GameObject[]): boolean => {
	for (const object of enemies.concat(enemyShots)) {
		if (collision(object, player)) return true;
	}
	return false;
}

export const updateState = (state: State, input: Input): State => {
	for (const star of state.stars) {
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

	if (input.interval % 10 === 0 && input.keys.includes('Space')) {
		state.playerShots.push(
			generateBullet(state.player, true, 'green')
		);
	}

	for (const bullet of state.playerShots) {
		move (bullet, 0, -bullet.speed,
			() => {	if (bullet.y <= 0) removeFromArray(state.playerShots, bullet); }
		);
	}

	for (const enemy of state.enemies) {
		move(enemy, 0, enemy.speed,
			() => {	if (enemy.y >= CANVAS_HEIGHT) removeFromArray(state.enemies, enemy); }
		);

		if (input.interval % 10 === 0 && getRandomIntInclusive(1, 10) === 1) {
			state.enemyShots.push(
				generateBullet(enemy, true, 'red')
			);
		}	
	}

	for (const bullet of state.enemyShots) {
		move(bullet, 0, bullet.speed,
			() => {	if (bullet.y >= CANVAS_HEIGHT) removeFromArray(state.enemyShots, bullet); }
		);
	}

	return {
		player: state.player,
		enemies: input.enemies,
		score: calculateScore(state.score, state.playerShots, input.enemies),
		gameOver: gameOver(state.player, input.enemies, state.enemyShots),
		stars: input.stars,	
		playerShots: state.playerShots,
		enemyShots: state.enemyShots
	}
};