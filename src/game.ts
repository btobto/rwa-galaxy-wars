import { CANVAS_HEIGHT } from "./constants";
import { Actor, Input, Star, State } from "./interfaces";

export const keysBuffer = (buffer: string[], event: KeyboardEvent): string[] => {
	const result = [...buffer];

	const index = buffer.indexOf(event.code);
	if (event.type === 'keydown' && index === -1) {
		result.push(event.code);
	} else if (event.type === 'keyup' && index > -1) {
		result.splice(index, 1);
	}

	return result;
}

export const getRandomIntInclusive = (min: number, max: number): number => (
	Math.floor(Math.random() * (max - min + 1) + min)
);

export const isOffScreen = (y: number, height: number): boolean => (
	y >= height
);

const updateStars = (stars: Star[]) => {
	stars.forEach((star: Star) => {
		if (star.y >= CANVAS_HEIGHT) {
			star.y = 0;
		}
		star.y += star.size;
	});
}

const processInput = (player: Actor, keys: string[]) => {
	if (keys.includes('ArrowLeft')) {
		player.x -= 5;
	}

	if (keys.includes('ArrowRight')) {
		player.x += 5;
	}

	if (keys.includes('ArrowUp')) {
		player.y -= 5;
	}

	if (keys.includes('ArrowDown')) {
		player.y += 5;
	}
}

const updateEnemies = (enemies: Actor[]) => {
	enemies.forEach(enemy => {
		if (enemy.y >= CANVAS_HEIGHT) {
			const index = enemies.indexOf(enemy);
			enemies.splice(index, 1);
		} else {
			enemy.y += 5;
			// enemy.x += getRandomIntInclusive(-2, +2);	
		}
	});
}

export const updateState = (state: State, input: Input): State => {
	updateStars(input.stars);
	processInput(state.player, input.keys);
	updateEnemies(input.enemies);

	return {
		player: state.player,
		enemies: input.enemies,
		playerBullets: state.playerBullets,
		enemyBullets: state.enemyBullets,
		score: 0,
		isGameOver: false,
		stars: input.stars,	
	}
}