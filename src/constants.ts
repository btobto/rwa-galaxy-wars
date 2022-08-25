import { GameObject, Particle, Ship } from "./interfaces";

export const FPS = 1000 / 60;
export const STAR_NUMBER = 200;
export const SPRITE_PATH = './src/assets';
export const ENEMY_FREQUENCY = 500;
export const ENEMY_SHOOTING_FREQUENCY = 400;
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 700;

export const SPRITE_NAMES = [
	'player.png',
	'enemy1.png',
	'enemy2.png',
];

export const PLAYER_DEFAULT: Ship = {
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	speed: 5,
	sprite: null,
	shots: [],
};

export const ENEMY1_DEFAULT: Ship = {
	x: 0,
	y: 0,
	width: 50,
	height: 54,
	speed: 5,
	sprite: null,
	shots: [],
};

export const ENEMY2_DEFAULT: Ship = {
	x: 0,
	y: 0,
	width: 56,
	height: 58,
	speed: 10,
	sprite: null,
	shots: [],
};

export const BULLET_DEFAULT: Particle = {
	x: 0,
	y: 0,
	width: 4,
	height: 10,
	speed: 0,
	color: null,
}