import { distinctUntilChanged, fromEvent, interval, map, merge, scan, startWith, tap, withLatestFrom } from "rxjs";
import { fps } from "./constants";
import { keysBuffer } from "./game";
import { Player } from "./player";
import { Renderer } from "./renderer";

const stats = document.getElementById('stats');
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 500;
canvas.height = 600;

const player = new Player(canvas.width / 2, canvas.height / 2);
const renderer = new Renderer(canvas, ctx);

const keysDown$ = fromEvent(document, 'keydown');
const keysUp$ = fromEvent(document, 'keyup');

const keyboard$ = merge(keysDown$, keysUp$).pipe(
	startWith([]),
	scan(keysBuffer, []),
	distinctUntilChanged(),
);

const galaxyWars$ = interval(fps).pipe(
	withLatestFrom(
		keyboard$
	),
	map(([interval, keys]: [number, string[]]) => keys),
	tap((keys: string[]) => {
		console.log(keys);
		player.move(keys);
		renderer.draw(player);
	}),
);

galaxyWars$.subscribe(
	
);

