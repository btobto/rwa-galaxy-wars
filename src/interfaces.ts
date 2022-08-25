export interface GameObject {
	x: number,
	y: number,
	width: number,
	height: number,
	speed: number,
	spriteOrColor: HTMLImageElement | string
}

export interface Input {
	interval: number, 
	keys: string[], 
	stars: GameObject[], 
	enemies: GameObject[],
}

export interface State {
	player: GameObject,
	playerShots: GameObject[],
	enemies: GameObject[],
	enemyShots: GameObject[],
	score: number,
	isGameOver: boolean,
	stars: GameObject[],
}