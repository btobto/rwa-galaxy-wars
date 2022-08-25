import { distinctUntilChanged, forkJoin, from, fromEvent, interval, map, merge, of, range, scan, startWith, switchMap, take, takeWhile, tap, toArray, withLatestFrom } from "rxjs";
import { FPS, STAR_NUMBER, SPRITE_PATH, SPRITE_NAMES, ENEMY_FREQUENCY, CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_DEFAULT, ENEMY2_DEFAULT, ENEMY1_DEFAULT, API_URL } from "./constants";
import { generateEnemy, updateState } from "./game";
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
// const getData$ = from(fetch(`${API_URL}/constants`)
// 	.then(res => {
// 		if (!res.ok) {
// 			throw new Error('Error fetching constants.');
// 		} else {
// 			return res.json();
// 		}
// 	})
// 	.catch(e => console.error(e))
// );

const spritesLoaded$ = forkJoin([
	...sprites.map(sprite => fromEvent(sprite, 'load').pipe(take(1))),
	getData$
]);

spritesLoaded$.subscribe(() => gameLoop$.subscribe());

ENEMY1_DEFAULT.spriteOrColor = sprites[1];
ENEMY2_DEFAULT.spriteOrColor = sprites[2];
const player: GameObject = {
	...PLAYER_DEFAULT,
	x: canvas.width / 2 - PLAYER_DEFAULT.width / 2,
	y: canvas.height / 1.5,
	spriteOrColor: sprites[0],
};

const initialState: State = {
	player: player,
	enemies: [],
	score: 0,
	gameOver: false,
	stars: [],
	playerShots: [],
	enemyShots: [],
};

const enemies$ = interval(ENEMY_FREQUENCY).pipe(
	startWith([]),
	scan((enemyArray: GameObject[], intrvl: number) => {
		let enemy: GameObject;
		if (intrvl % 5 === 0) {
			enemy = generateEnemy(ENEMY2_DEFAULT);
		} else {
			enemy = generateEnemy(ENEMY1_DEFAULT);
		};

		enemyArray.push(enemy);
		
		return enemyArray;
	}, []),
);

const stars$ = range(1, STAR_NUMBER).pipe(
	map((): GameObject => {
		const attribute = Math.random() * 3 + 1;
		return {
			x: Math.floor(Math.random() * canvas.width),
			y: Math.floor(Math.random() * canvas.height),
			width: attribute,
			height: attribute,
			speed: attribute,
			spriteOrColor: 'white',
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
	takeWhile((state: State) => !state.gameOver),
);