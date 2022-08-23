import { distinctUntilChanged, fromEvent, interval, map, merge, range, scan, startWith, tap, toArray, withLatestFrom, zip } from "rxjs";
import { FPS, STAR_NUMBER, SPRITE_PATH, SPRITE_NAMES, ENEMY_FREQUENCY, PLAYER_SIZE, ENEMY2_SIZE, ENEMY1_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
import { keysBuffer, updateState } from "./game";
import { Actor, Input, Star, State } from "./interfaces";
import { draw } from "./renderer";

const scoreContainer = document.getElementById('score');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const sprites: HTMLImageElement[] = SPRITE_NAMES.map((name: string) => {
	const sprite = new Image();
	sprite.src = `${SPRITE_PATH}/${name}`;
	return sprite;
});

const spritesLoaded$ = zip(
	...sprites.map(sprite => fromEvent(sprite, 'load')),
);

spritesLoaded$.subscribe(() => galaxyWars$.subscribe());

const player: Actor = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	sprite: sprites[0],
	width: PLAYER_SIZE.width,
	height: PLAYER_SIZE.height,
	speed: PLAYER_SIZE.speed,
};

const initialState: State = {
	player: player,
	enemies: [],
	playerBullets: [],
	enemyBullets: [],
	score: 0,
	isGameOver: false,
	stars: [],
};

const enemies$ = interval(ENEMY_FREQUENCY).pipe(
	startWith([]),
	scan((enemyArray: Actor[], interval: number) => {
		let enemy: Actor;
		if (interval % 5 === 0) {
			enemy = {
				x: Math.floor(Math.random() * canvas.width),
				y: -ENEMY2_SIZE.height,
				sprite: sprites[2],
				width: ENEMY2_SIZE.width,
				height: ENEMY2_SIZE.height,
				speed: ENEMY2_SIZE.speed, 
			};
		} else {
			enemy = {
				x: Math.floor(Math.random() * canvas.width),
				y: -ENEMY1_SIZE.height,
				sprite: sprites[1],
				width: ENEMY1_SIZE.width,
				height: ENEMY1_SIZE.height,
				speed: ENEMY1_SIZE.speed, 
			};
		}
		enemyArray.push(enemy);

		return enemyArray;
	}, []),
)

const stars$ = range(1, STAR_NUMBER).pipe(
	map((): Star => ({
		x: Math.floor(Math.random() * canvas.width),
		y: Math.floor(Math.random() * canvas.height),
		size: Math.random() * 3 + 1,
	})),
	toArray(),
)

const keysDown$ = fromEvent(document, 'keydown');
const keysUp$ = fromEvent(document, 'keyup');

const keyboard$ = merge(keysDown$, keysUp$).pipe(
	startWith([]),
	scan(keysBuffer, []),
	distinctUntilChanged(),
);

const galaxyWars$ = interval(FPS).pipe(
	withLatestFrom(
		keyboard$,
		stars$,
		enemies$
	),
	map((data): Input => ({
		interval: data[0],
		keys: data[1],
		stars: data[2],
		enemies: data[3]
	})),
	scan(updateState, initialState),
	tap((state: State) => {
		draw(ctx, scoreContainer, state);
	}),
);
