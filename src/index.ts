import { distinctUntilChanged, fromEvent, interval, map, merge, range, scan, startWith, tap, toArray, withLatestFrom } from "rxjs";
import { fps, starNumber } from "./constants";
import { keysBuffer } from "./game";
import { Star } from "./interfaces";
import { Player } from "./player";
import { Renderer } from "./renderer";

const stats = document.getElementById('stats');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 500;
canvas.height = 600;

const player = new Player(canvas.width / 2, canvas.height / 2);
const renderer = new Renderer(canvas, ctx);

const starStream$ = range(1, starNumber).pipe(
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

const galaxyWars$ = interval(fps).pipe(
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

galaxyWars$.subscribe(
	
);

