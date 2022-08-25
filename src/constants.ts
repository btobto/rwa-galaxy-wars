import { GameObject } from "./interfaces";

export const FPS = 1000 / 60;
export const STAR_NUMBER = 200;
export const SPRITE_PATH = './src/assets';
export const ENEMY_FREQUENCY = 300;
export const ENEMY_SHOOTING_FREQUENCY = 400;
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 700;

export const SPRITE_NAMES = [
	'player.png',
	'enemy1.png',
	'enemy2.png',
];

export const PLAYER_DEFAULT: GameObject = {
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	speed: 5,
	spriteOrColor: null,
};

export const ENEMY1_DEFAULT: GameObject = {
	x: 0,
	y: 0,
	width: 50,
	height: 54,
	speed: 5,
	spriteOrColor: null,
};

export const ENEMY2_DEFAULT: GameObject = {
	x: 0,
	y: 0,
	width: 56,
	height: 58,
	speed: 8,
	spriteOrColor: null,
};

export const BULLET_DEFAULT: GameObject = {
	x: 0,
	y: 0,
	width: 4,
	height: 10,
	speed: 0,
	spriteOrColor: null,
}