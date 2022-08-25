import { combineLatest, distinctUntilChanged, forkJoin, fromEvent, interval, map, merge, mergeAll, mergeMap, of, range, sampleTime, scan, startWith, switchMap, take, takeWhile, tap, toArray, withLatestFrom } from "rxjs";
import { FPS, STAR_NUMBER, SPRITE_PATH, SPRITE_NAMES, ENEMY_FREQUENCY, CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_DEFAULT, ENEMY2_DEFAULT, ENEMY1_DEFAULT, ENEMY_SHOOTING_FREQUENCY, BULLET_DEFAULT } from "./constants";
// import * as Constants from "./constants";
import { generateBullet, generateEnemy, getRandomIntInclusive, updateState } from "./game";
import { GameObject, Input, Particle, Ship, State } from "./interfaces";
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

spritesLoaded$.subscribe(() => gameLoop$.subscribe());

ENEMY1_DEFAULT.sprite = sprites[1];
ENEMY2_DEFAULT.sprite = sprites[2];
const player: Ship = {
	...PLAYER_DEFAULT,
	x: canvas.width / 2 - PLAYER_DEFAULT.width / 2,
	y: canvas.height / 1.5,
	sprite: sprites[0],
};

const initialState: State = {
	player: player,
	enemies: [],
	score: 0,
	isGameOver: false,
	stars: [],
};

const enemies$ = interval(ENEMY_FREQUENCY).pipe(
	startWith([]),
	scan((enemyArray: Ship[], intrvl: number) => {
		let enemy: Ship;
		if (intrvl % 5 === 0) {
			enemy = generateEnemy(ENEMY2_DEFAULT);
		} else {
			enemy = generateEnemy(ENEMY1_DEFAULT);
		};

		enemyArray.push(enemy);
		
		return enemyArray;

	}, []),
	// tap(e => console.log('enemies ', e)),
);

const stars$ = range(1, STAR_NUMBER).pipe(
	map((): Particle => {
		const attribute = Math.random() * 3 + 1;
		return {
			x: Math.floor(Math.random() * canvas.width),
			y: Math.floor(Math.random() * canvas.height),
			width: attribute,
			height: attribute,
			speed: attribute,
			color: 'white',
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

const gameLoop$ = interval(FPS).pipe(
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
	takeWhile(state => !state.isGameOver),
);