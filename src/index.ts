import { distinctUntilChanged, forkJoin, from, fromEvent, interval, map, merge, mergeMap, of, range, scan, startWith, switchMap, tap, toArray, withLatestFrom, zip } from "rxjs";
import { FPS, STAR_NUMBER, SPRITE_PATH, SPRITE_NAMES } from "./constants";
import { keysBuffer, run } from "./game";
import { Star } from "./interfaces";
import { Player } from "./player";
import { Renderer } from "./renderer";

const scoreContainer = document.getElementById('score');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 500;
canvas.height = 600;

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

const starStream$ = range(1, STAR_NUMBER).pipe(
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
		starStream$,
	),
	tap(([interval, keys, stars]: [number, string[], Star[]]) => {
		stars.forEach((star: Star) => {
			if (star.y >= canvas.height) {
				star.y = 0;
			}
			star.y += star.size;
		});
	}),
	tap(([interval, keys, stars]: [number, string[], Star[]]) => {
		console.log(keys);
		player.move(keys);
		renderer.draw(player, stars);
	}),
);
