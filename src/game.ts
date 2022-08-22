export const keysBuffer = (buffer: string[], event: KeyboardEvent): string[] => {
	const result = [...buffer];

	const index = buffer.indexOf(event.code);
	if (event.type === 'keydown' && index === -1) {
		result.push(event.code);
	} else if (event.type === 'keyup' && index > -1) {
		result.splice(index, 1);
	}

	return result;
}