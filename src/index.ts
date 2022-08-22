import { distinctUntilChanged, fromEvent, interval, merge, scan, startWith, tap, withLatestFrom } from "rxjs";
import { fps } from "./constants";

const info = document.getElementById('info');
const score = document.getElementById('score');

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = 500;
canvas.height = 600;

const getRandomInt = (min: number, max: number) => Math.random() * (max - min) + min;

const keysBuffer = (buffer: string[], event: KeyboardEvent): string[] => {
	const result = [...buffer];

	const index = buffer.indexOf(event.code);
	if (event.type === 'keydown' && index === -1) {
		result.push(event.code);
	} else if (event.type === 'keyup' && index > -1) {
		result.splice(index, 1);
	}

	return result;
}

const draw = () => {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}	

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
	tap(([interval, keys]: [number, string[]]) => {
		console.log(keys);
		draw();
	}),
);

galaxyWars$.subscribe(
	
);

