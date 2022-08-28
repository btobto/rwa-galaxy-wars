import { distinctUntilChanged, from, fromEvent, interval, map, merge, mergeMap, Observable, range, scan, startWith, switchMap, take, takeWhile, tap, toArray, withLatestFrom } from "rxjs";
import { FPS, STAR_NUMBER, ENEMY_FREQUENCY, CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_TEMPLATE, ENEMY2_TEMPLATE, ENEMY1_TEMPLATE, API_URL, INITIAL_STATE } from "./constants";
import { generateEnemy, updateState } from "./game";
import { GameObject, Input, State } from "./interfaces";
import { draw } from "./renderer";

const scoreContainer = document.getElementById('score');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const player: GameObject = {
	...PLAYER_TEMPLATE,
	x: canvas.width / 2 - PLAYER_TEMPLATE.width / 2,
	y: canvas.height / 1.5,
};
INITIAL_STATE.player = player;

const fetchData$ = <T>(name: string): Observable<T> => {
	return from(fetch(`${API_URL}/${name}`)
		.then(res => {
			if (!res.ok) {
				throw new Error('Error fetching data.');
			} else {
				return res.json();
			}
		})
		.catch(e => console.error(e))
	);
}

const sprites$ = fetchData$<{
	path: string,
	images: string[] 
}>('sprites').pipe(
	map((data) => data.images.map(img => {
		const sprite = new Image();
		sprite.src = `${data.path}/${img}`;
		return sprite;
	})),
	tap((sprites: HTMLImageElement[]) => {
		player.spriteOrColor = sprites[0];
		ENEMY1_TEMPLATE.spriteOrColor = sprites[1];
		ENEMY2_TEMPLATE.spriteOrColor = sprites[2];
	}),
	switchMap((sprites: HTMLImageElement[]) => from(sprites)),
	mergeMap((sprite: HTMLImageElement) => fromEvent(sprite, 'load').pipe(take(1))),
	toArray(),
	// tap(a => console.log(a)),
)

sprites$.subscribe(() => gameLoop$.subscribe());

const enemies$ = interval(ENEMY_FREQUENCY).pipe(
	startWith([]),
	scan((enemyArray: GameObject[], intrvl: number) => {
		let enemy: GameObject;
		
		if (intrvl % 5 === 0) {
			enemy = generateEnemy(ENEMY2_TEMPLATE);
		} else {
			enemy = generateEnemy(ENEMY1_TEMPLATE);
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

const keyboard$ = merge(
	fromEvent(document, 'keydown'),
	fromEvent(document, 'keyup'),
).pipe(
	startWith([]),
	scan((buffer: string[], event: KeyboardEvent): string[] => {
		const index = buffer.indexOf(event.code);

		if (event.type === 'keydown' && index === -1) {
			buffer.push(event.code);
		} else if (event.type === 'keyup' && index > -1) {
			buffer.splice(index, 1);
		}

		return buffer;
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
	scan(updateState, INITIAL_STATE),
	tap((state: State) => draw(ctx, scoreContainer, state)),
	takeWhile((state: State) => !state.gameOver),
);