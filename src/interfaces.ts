export interface GameObject {
	x: number,
	y: number,
	width: number,
	height: number,
	speed: number,
	sprite?: HTMLImageElement,
}
export interface Input {
	interval: number, 
	keys: string[], 
	stars: GameObject[], 
	enemies: GameObject[],
}

export interface State {
	player: GameObject,
	enemies: GameObject[],
	playerBullets: GameObject[],
	enemyBullets: GameObject[]
	score: number,
	isGameOver: boolean,
	stars: GameObject[],
}