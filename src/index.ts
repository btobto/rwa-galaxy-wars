import { distinctUntilChanged, forkJoin, from, fromEvent, interval, map, merge, mergeMap, of, range, scan, startWith, switchMap, tap, toArray, withLatestFrom, zip } from "rxjs";
import { FPS, STAR_NUMBER, SPRITE_PATH, SPRITE_NAMES, ENEMY_FREQUENCY } from "./constants";
import { Enemy } from "./enemy";
import { isOffScreen, keysBuffer } from "./game";
import { Star } from "./interfaces";
import { Player } from "./player";
import { Renderer } from "./renderer";

const scoreContainer = document.getElementById('score');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 1000;
canvas.height = 700;

const sprites: HTMLImageElement[] = SPRITE_NAMES.map((name: string) => {
	const sprite = new Image();
	sprite.src = `${SPRITE_PATH}/${name}`;
	return sprite;
});

const spritesLoaded$ = zip(
	...sprites.map(sprite => fromEvent(sprite, 'load')),
);

spritesLoaded$.subscribe(() => galaxyWars$.subscribe());

const player = new Player(
	canvas.width / 2, 
	canvas.height / 2,
	sprites[0],
	);

const renderer = new Renderer(canvas, ctx);

const enemies$ = interval(ENEMY_FREQUENCY).pipe(
	startWith([]),
	scan((enemyArray: Enemy[]) => {
		const enemy = new Enemy(
			Math.floor(Math.random() * canvas.width),
			-64,
			sprites[1],
		);

		enemyArray.push(enemy);
		return enemyArray;
	}, []),
)

const star$ = range(1, STAR_NUMBER).pipe(
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
		star$,
		enemies$
	),
	tap(([interval, keys, stars, enemies]: [number, string[], Star[], Enemy[]]) => {
		// console.log(keys);
		stars.forEach((star: Star) => {
			if (star.y >= canvas.height) {
				star.y = 0;
			}
			star.y += star.size;
		});
		player.move(keys);
		console.log(enemies);
		enemies.forEach(enemy => {
			if (isOffScreen(enemy.y, canvas.height)) {
				const index = enemies.indexOf(enemy);
				enemies.splice(index, 1);
			} else {
				enemy.move();
			}
		});
		renderer.draw(player, stars, enemies);
	}),
);
