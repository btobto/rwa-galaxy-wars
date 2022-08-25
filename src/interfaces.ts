export interface GameObject {
	x: number,
	y: number,
	width: number,
	height: number,
	speed: number,
}

export interface Ship extends GameObject {
	sprite: HTMLImageElement,
	shots: Particle[],
}

export interface Particle extends GameObject {
	color: string,
}

export interface Input {
	interval: number, 
	keys: string[], 
	stars: Particle[], 
	enemies: Ship[],
}

export interface State {
	player: Ship,
	enemies: Ship[],
	score: number,
	isGameOver: boolean,
	stars: Particle[],
}