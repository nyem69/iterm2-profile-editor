import type { ITerm2Color } from '$lib/types/profile';

/** Convert iTerm2 color (0-1 range) to hex string */
export function colorToHex(color: ITerm2Color): string {
	const r = Math.round(color['Red Component'] * 255);
	const g = Math.round(color['Green Component'] * 255);
	const b = Math.round(color['Blue Component'] * 255);
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Convert hex string to iTerm2 color */
export function hexToColor(hex: string, alpha = 1, colorSpace = 'sRGB'): ITerm2Color {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	return {
		'Red Component': r,
		'Green Component': g,
		'Blue Component': b,
		'Alpha Component': alpha,
		'Color Space': colorSpace,
	};
}

/** Get CSS color string from iTerm2 color */
export function colorToCSS(color: ITerm2Color): string {
	const r = Math.min(255, Math.max(0, Math.round((Number(color['Red Component']) || 0) * 255)));
	const g = Math.min(255, Math.max(0, Math.round((Number(color['Green Component']) || 0) * 255)));
	const b = Math.min(255, Math.max(0, Math.round((Number(color['Blue Component']) || 0) * 255)));
	const a = Math.min(1, Math.max(0, Number(color['Alpha Component']) ?? 1));
	if (a < 1) return `rgba(${r}, ${g}, ${b}, ${a})`;
	return `rgb(${r}, ${g}, ${b})`;
}
