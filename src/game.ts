import { BULLET_TEMPLATE, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";
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
	...BULLET_TEMPLATE,
	x: ship.x + ship.width / 2 - BULLET_TEMPLATE.width / 2,
	y: shootsUp ? ship.y : ship.y + ship.height,
	speed: ship.speed + 5,
	spriteOrColor: color,
})

const collision = (object1: GameObject, object2: GameObject): boolean => (
	object1.x < object2.x + object2.width && object1.x + object1.width > object2.x &&
	object1.y < object2.y + object2.height && object1.y + object1.height > object2.y
)

const removeFromArray = (array: GameObject[], object: GameObject) => {
	const index = array.indexOf(object);
	array.splice(index, 1);
}

const calculateScore = (oldScore: number, playerShots: GameObject[], enemies: GameObject[]): number => {
	let newPoints = 0;
	for (const bullet of playerShots) {
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

const updateStars = (stars: GameObject[]) => {
	for (const star of stars) {
		star.y += star.speed;

		if (star.y >= CANVAS_HEIGHT) star.y = 0;
	}
}

const updatePlayer = (player: GameObject, keys: string[]) => {
	let dX = 0;
	let dY = 0;

	if (keys.includes('ArrowLeft')) {
		dX -= player.speed;
	}
	if (keys.includes('ArrowRight')) {
		dX += player.speed;
	}
	if (keys.includes('ArrowUp')) {
		dY -= player.speed;
	}
	if (keys.includes('ArrowDown')) {
		dY += player.speed;
	}

	player.x += dX;
	player.y += dY;

	if (player.x < 0) {
		player.x = 0;
	} else if (player.x + player.width >= CANVAS_WIDTH) {
		player.x = CANVAS_WIDTH - player.width;
	}

	if (player.y < 0) {
		player.y = 0;
	} else if (player.y + player.height >= CANVAS_HEIGHT) {
		player.y = CANVAS_HEIGHT - player.height;
	}
}

const updatePlayerShots = (
	player: GameObject, 
	playerShots: GameObject[], 
	keys: string[], 
	interval: number
) => {
	if (interval % 10 === 0 && keys.includes('Space')) {
		playerShots.push(
			generateBullet(player, true, 'green')
		);
	}

	for (const bullet of playerShots) {
		bullet.y -= bullet.speed;

		if (bullet.y <= 0) removeFromArray(playerShots, bullet); 
	}
}

const updateEnemies = (enemies: GameObject[]) => {
	for (const enemy of enemies) {
		enemy.y += enemy.speed;

		if (enemy.y >= CANVAS_HEIGHT) removeFromArray(enemies, enemy);
	}
}

const updateEnemyShots = (
	enemies: GameObject[], 
	enemyShots: GameObject[], 
	interval: number
) => {
	for (const enemy of enemies) {
		if (interval % 10 === 0 && getRandomIntInclusive(1, 10) === 1) {
			enemyShots.push(
				generateBullet(enemy, false, 'red')
			);
		}	
	}

	for (const bullet of enemyShots) {
		bullet.y += bullet.speed;

		if (bullet.y >= CANVAS_HEIGHT) removeFromArray(enemyShots, bullet);
	}
}

export const updateState = (state: State, input: Input): State => {
	updateStars(input.stars);
	updatePlayer(state.player, input.keys);
	updatePlayerShots(state.player, state.playerShots, input.keys, input.interval);	
	updateEnemies(input.enemies);
	updateEnemyShots(input.enemies, state.enemyShots, input.interval);

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