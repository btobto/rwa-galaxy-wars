export interface Star {
	x: number,
	y: number,
	size: number,
}

export interface Actor {
	x: number,
	y: number,
	readonly sprite: HTMLImageElement,
	readonly width: number,
	readonly height: number,
	readonly speed: number,
}

export interface Bullet {
	x: number,
	y: number,
	width: number,
	height: number,
};

export interface Input {
	interval: number, 
	keys: string[], 
	stars: Star[], 
	enemies: Actor[]
}

export interface State {
	player: Actor,
	enemies: Actor[],
	playerBullets: Bullet[],
	enemyBullets: Bullet[]
	score: number,
	isGameOver: boolean,
	stars: Star[],
}