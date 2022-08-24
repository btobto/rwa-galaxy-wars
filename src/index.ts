import { auditTime, concatAll, debounceTime, distinctUntilChanged, filter, forkJoin, fromEvent, interval, map, mapTo, merge, mergeAll, of, range, sample, sampleTime, scan, startWith, take, tap, throttleTime, timestamp, toArray, withLatestFrom, zip, zipWith } from "rxjs";
import { FPS, STAR_NUMBER, SPRITE_PATH, SPRITE_NAMES, ENEMY_FREQUENCY, CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_DEFAULT, ENEMY2_DEFAULT, ENEMY1_DEFAULT } from "./constants";
// import * as Constants from "./constants";
import { getRandomIntInclusive, updateState } from "./game";
import { GameObject, Input, State } from "./interfaces";
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

// todo
const getData$ = of(undefined);

const spritesLoaded$ = forkJoin([
	...sprites.map(sprite => fromEvent(sprite, 'load').pipe(take(1))),
	getData$,
]);

spritesLoaded$.subscribe(() => galaxyWars$.subscribe());

const player: GameObject = {
	...PLAYER_DEFAULT,
	x: canvas.width / 2 - PLAYER_DEFAULT.width / 2,
	y: canvas.height / 1.5,
	sprite: sprites[0],
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
	scan((enemyArray: GameObject[], interval: number) => {
		let enemy: GameObject;
		if (interval % 5 === 0) {
			enemy = {
				...ENEMY2_DEFAULT,
				x: getRandomIntInclusive(0, CANVAS_WIDTH - ENEMY2_DEFAULT.width),
				y: -ENEMY2_DEFAULT.height,
				sprite: sprites[2],
			};
		} else {
			enemy = {
				...ENEMY1_DEFAULT,
				x: getRandomIntInclusive(0, CANVAS_WIDTH - ENEMY1_DEFAULT.width),
				y: -ENEMY1_DEFAULT.height,
				sprite: sprites[1],
			};
		}
		enemyArray.push(enemy);

		return enemyArray;
	}, []),
)

const stars$ = range(1, STAR_NUMBER).pipe(
	map((): GameObject => {
		const attribute = Math.random() * 3 + 1;
		return {
			x: Math.floor(Math.random() * canvas.width),
			y: Math.floor(Math.random() * canvas.height),
			width: attribute,
			height: attribute,
			speed: attribute,
		}
	}),
	toArray(),
)

const keysDown$ = fromEvent(document, 'keydown');
const keysUp$ = fromEvent(document, 'keyup');

const keyboard$ = merge(keysDown$, keysUp$).pipe(
	startWith([]),
	scan((buffer: string[], event: KeyboardEvent): string[] => {
		const result = [...buffer];
	
		const index = buffer.indexOf(event.code);
		if (event.type === 'keydown' && index === -1) {
			result.push(event.code);
		} else if (event.type === 'keyup' && index > -1) {
			result.splice(index, 1);
		}
	
		return result;
	}, []),
	distinctUntilChanged(),
);

const galaxyWars$ = interval(FPS).pipe(
	withLatestFrom(
		keyboard$,
		stars$,
		enemies$,
	),
	map((data): Input => ({
		interval: data[0],
		keys: data[1],
		stars: data[2],
		enemies: data[3],
	})),
	scan(updateState, initialState),
	tap((state: State) => draw(ctx, scoreContainer, state)),
);
