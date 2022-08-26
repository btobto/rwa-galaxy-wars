import { GameObject, State } from "./interfaces";

export const API_URL = 'http://localhost:3000';

export const FPS = 1000 / 60;
export const STAR_NUMBER = 200;
export const ENEMY_FREQUENCY = 300;
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 700;

export const INITIAL_STATE: State = {
	player: null,
	enemies: [],
	score: 0,
	gameOver: false,
	stars: [],
	playerShots: [],
	enemyShots: [],
};

export const PLAYER_TEMPLATE: GameObject = {
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	speed: 5,
	spriteOrColor: null,
};

export const ENEMY1_TEMPLATE: GameObject = {
	x: 0,
	y: 0,
	width: 50,
	height: 54,
	speed: 5,
	spriteOrColor: null,
};

export const ENEMY2_TEMPLATE: GameObject = {
	x: 0,
	y: 0,
	width: 56,
	height: 58,
	speed: 8,
	spriteOrColor: null,
};

export const BULLET_TEMPLATE: GameObject = {
	x: 0,
	y: 0,
	width: 4,
	height: 10,
	speed: 0,
	spriteOrColor: null,
}