export interface ITerm2Color {
	'Red Component': number;
	'Green Component': number;
	'Blue Component': number;
	'Alpha Component': number;
	'Color Space': string;
}

export const ANSI_COLOR_KEYS = [
	'Ansi 0 Color', 'Ansi 1 Color', 'Ansi 2 Color', 'Ansi 3 Color',
	'Ansi 4 Color', 'Ansi 5 Color', 'Ansi 6 Color', 'Ansi 7 Color',
	'Ansi 8 Color', 'Ansi 9 Color', 'Ansi 10 Color', 'Ansi 11 Color',
	'Ansi 12 Color', 'Ansi 13 Color', 'Ansi 14 Color', 'Ansi 15 Color',
] as const;

export const SPECIAL_COLOR_KEYS = [
	'Background Color', 'Foreground Color', 'Bold Color',
	'Cursor Color', 'Selection Color',
] as const;

export const ALL_COLOR_KEYS = [...SPECIAL_COLOR_KEYS, ...ANSI_COLOR_KEYS] as const;

export type ColorKey = (typeof ALL_COLOR_KEYS)[number];

export const ANSI_COLOR_NAMES = [
	'Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White',
	'Bright Black', 'Bright Red', 'Bright Green', 'Bright Yellow',
	'Bright Blue', 'Bright Magenta', 'Bright Cyan', 'Bright White',
] as const;

export interface ITerm2Profile {
	Name: string;
	Guid: string;
	'Dynamic Profile Parent Name'?: string;
	Tags?: string[];

	// Colors
	'Background Color'?: ITerm2Color;
	'Foreground Color'?: ITerm2Color;
	'Bold Color'?: ITerm2Color;
	'Cursor Color'?: ITerm2Color;
	'Selection Color'?: ITerm2Color;
	'Ansi 0 Color'?: ITerm2Color;
	'Ansi 1 Color'?: ITerm2Color;
	'Ansi 2 Color'?: ITerm2Color;
	'Ansi 3 Color'?: ITerm2Color;
	'Ansi 4 Color'?: ITerm2Color;
	'Ansi 5 Color'?: ITerm2Color;
	'Ansi 6 Color'?: ITerm2Color;
	'Ansi 7 Color'?: ITerm2Color;
	'Ansi 8 Color'?: ITerm2Color;
	'Ansi 9 Color'?: ITerm2Color;
	'Ansi 10 Color'?: ITerm2Color;
	'Ansi 11 Color'?: ITerm2Color;
	'Ansi 12 Color'?: ITerm2Color;
	'Ansi 13 Color'?: ITerm2Color;
	'Ansi 14 Color'?: ITerm2Color;
	'Ansi 15 Color'?: ITerm2Color;

	// Font
	'Normal Font'?: string;
	'Non Ascii Font'?: string;

	// Terminal
	Columns?: number;
	Rows?: number;
	'Scrollback Lines'?: number;
	'Unlimited Scrollback'?: boolean;

	// Cursor
	'Cursor Type'?: number;
	'Blinking Cursor'?: boolean;

	// Bell
	'Silence Bell'?: boolean;
	'Visual Bell'?: boolean;

	// Font rendering
	'ASCII Anti Aliased'?: boolean;
	'Non-ASCII Anti Aliased'?: boolean;

	// Command
	'Custom Command'?: 'Yes' | 'No';
	Command?: string;

	// Other
	'Option Key Sends'?: number;
	Transparency?: number;
	'Session Close Undo Timeout'?: number;

	// Allow additional keys
	[key: string]: unknown;
}

export interface ITerm2ProfilesFile {
	Profiles: ITerm2Profile[];
}
