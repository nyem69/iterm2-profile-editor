import type { ITerm2Color, ColorKey } from '$lib/types/profile';

export type ColorPreset = Record<ColorKey, ITerm2Color>;

function c(r: number, g: number, b: number, a = 1): ITerm2Color {
	return {
		'Red Component': r / 255,
		'Green Component': g / 255,
		'Blue Component': b / 255,
		'Alpha Component': a,
		'Color Space': 'sRGB',
	};
}

export const COLOR_PRESETS: Record<string, ColorPreset> = {
	'Dracula': {
		'Background Color': c(40, 42, 54),       // #282a36
		'Foreground Color': c(248, 248, 242),     // #f8f8f2
		'Bold Color': c(255, 255, 255),           // #ffffff
		'Cursor Color': c(248, 248, 242),         // #f8f8f2
		'Selection Color': c(68, 71, 90),         // #44475a
		'Ansi 0 Color': c(33, 34, 44),            // #21222c
		'Ansi 1 Color': c(255, 85, 85),           // #ff5555
		'Ansi 2 Color': c(80, 250, 123),          // #50fa7b
		'Ansi 3 Color': c(241, 250, 140),         // #f1fa8c
		'Ansi 4 Color': c(98, 114, 164),          // #6272a4
		'Ansi 5 Color': c(255, 121, 198),         // #ff79c6
		'Ansi 6 Color': c(139, 233, 253),         // #8be9fd
		'Ansi 7 Color': c(248, 248, 242),         // #f8f8f2
		'Ansi 8 Color': c(98, 114, 164),          // #6272a4
		'Ansi 9 Color': c(255, 110, 110),         // #ff6e6e
		'Ansi 10 Color': c(105, 255, 148),        // #69ff94
		'Ansi 11 Color': c(255, 255, 165),        // #ffffa5
		'Ansi 12 Color': c(214, 172, 255),        // #d6acff
		'Ansi 13 Color': c(255, 146, 208),        // #ff92d0
		'Ansi 14 Color': c(164, 255, 255),        // #a4ffff
		'Ansi 15 Color': c(255, 255, 255),        // #ffffff
	},

	'Solarized Dark': {
		'Background Color': c(0, 43, 54),         // #002b36
		'Foreground Color': c(131, 148, 150),     // #839496
		'Bold Color': c(147, 161, 161),           // #93a1a1
		'Cursor Color': c(131, 148, 150),         // #839496
		'Selection Color': c(7, 54, 66),          // #073642
		'Ansi 0 Color': c(7, 54, 66),             // #073642
		'Ansi 1 Color': c(220, 50, 47),           // #dc322f
		'Ansi 2 Color': c(133, 153, 0),           // #859900
		'Ansi 3 Color': c(181, 137, 0),           // #b58900
		'Ansi 4 Color': c(38, 139, 210),          // #268bd2
		'Ansi 5 Color': c(211, 54, 130),          // #d33682
		'Ansi 6 Color': c(42, 161, 152),          // #2aa198
		'Ansi 7 Color': c(238, 232, 213),         // #eee8d5
		'Ansi 8 Color': c(0, 43, 54),             // #002b36
		'Ansi 9 Color': c(203, 75, 22),           // #cb4b16
		'Ansi 10 Color': c(88, 110, 117),         // #586e75
		'Ansi 11 Color': c(101, 123, 131),        // #657b83
		'Ansi 12 Color': c(131, 148, 150),        // #839496
		'Ansi 13 Color': c(108, 113, 196),        // #6c71c4
		'Ansi 14 Color': c(147, 161, 161),        // #93a1a1
		'Ansi 15 Color': c(253, 246, 227),        // #fdf6e3
	},

	'Solarized Light': {
		'Background Color': c(253, 246, 227),     // #fdf6e3
		'Foreground Color': c(101, 123, 131),     // #657b83
		'Bold Color': c(88, 110, 117),            // #586e75
		'Cursor Color': c(101, 123, 131),         // #657b83
		'Selection Color': c(238, 232, 213),      // #eee8d5
		'Ansi 0 Color': c(7, 54, 66),             // #073642
		'Ansi 1 Color': c(220, 50, 47),           // #dc322f
		'Ansi 2 Color': c(133, 153, 0),           // #859900
		'Ansi 3 Color': c(181, 137, 0),           // #b58900
		'Ansi 4 Color': c(38, 139, 210),          // #268bd2
		'Ansi 5 Color': c(211, 54, 130),          // #d33682
		'Ansi 6 Color': c(42, 161, 152),          // #2aa198
		'Ansi 7 Color': c(238, 232, 213),         // #eee8d5
		'Ansi 8 Color': c(0, 43, 54),             // #002b36
		'Ansi 9 Color': c(203, 75, 22),           // #cb4b16
		'Ansi 10 Color': c(88, 110, 117),         // #586e75
		'Ansi 11 Color': c(101, 123, 131),        // #657b83
		'Ansi 12 Color': c(131, 148, 150),        // #839496
		'Ansi 13 Color': c(108, 113, 196),        // #6c71c4
		'Ansi 14 Color': c(147, 161, 161),        // #93a1a1
		'Ansi 15 Color': c(253, 246, 227),        // #fdf6e3
	},

	'Nord': {
		'Background Color': c(46, 52, 64),        // #2e3440
		'Foreground Color': c(216, 222, 233),     // #d8dee9
		'Bold Color': c(236, 239, 244),           // #eceff4
		'Cursor Color': c(216, 222, 233),         // #d8dee9
		'Selection Color': c(67, 76, 94),         // #434c5e
		'Ansi 0 Color': c(59, 66, 82),            // #3b4252
		'Ansi 1 Color': c(191, 97, 106),          // #bf616a
		'Ansi 2 Color': c(163, 190, 140),         // #a3be8c
		'Ansi 3 Color': c(235, 203, 139),         // #ebcb8b
		'Ansi 4 Color': c(129, 161, 193),         // #81a1c1
		'Ansi 5 Color': c(180, 142, 173),         // #b48ead
		'Ansi 6 Color': c(136, 192, 208),         // #88c0d0
		'Ansi 7 Color': c(229, 233, 240),         // #e5e9f0
		'Ansi 8 Color': c(76, 86, 106),           // #4c566a
		'Ansi 9 Color': c(191, 97, 106),          // #bf616a
		'Ansi 10 Color': c(163, 190, 140),        // #a3be8c
		'Ansi 11 Color': c(235, 203, 139),        // #ebcb8b
		'Ansi 12 Color': c(129, 161, 193),        // #81a1c1
		'Ansi 13 Color': c(180, 142, 173),        // #b48ead
		'Ansi 14 Color': c(143, 188, 187),        // #8fbcbb
		'Ansi 15 Color': c(236, 239, 244),        // #eceff4
	},

	'Monokai': {
		'Background Color': c(39, 40, 34),        // #272822
		'Foreground Color': c(248, 248, 242),     // #f8f8f2
		'Bold Color': c(255, 255, 255),           // #ffffff
		'Cursor Color': c(248, 248, 240),         // #f8f8f0
		'Selection Color': c(73, 72, 62),         // #49483e
		'Ansi 0 Color': c(39, 40, 34),            // #272822
		'Ansi 1 Color': c(249, 38, 114),          // #f92672
		'Ansi 2 Color': c(166, 226, 46),          // #a6e22e
		'Ansi 3 Color': c(244, 191, 117),         // #f4bf75
		'Ansi 4 Color': c(102, 217, 239),         // #66d9ef
		'Ansi 5 Color': c(174, 129, 255),         // #ae81ff
		'Ansi 6 Color': c(161, 239, 228),         // #a1efe4
		'Ansi 7 Color': c(248, 248, 242),         // #f8f8f2
		'Ansi 8 Color': c(117, 113, 94),          // #75715e
		'Ansi 9 Color': c(249, 38, 114),          // #f92672
		'Ansi 10 Color': c(166, 226, 46),         // #a6e22e
		'Ansi 11 Color': c(244, 191, 117),        // #f4bf75
		'Ansi 12 Color': c(102, 217, 239),        // #66d9ef
		'Ansi 13 Color': c(174, 129, 255),        // #ae81ff
		'Ansi 14 Color': c(161, 239, 228),        // #a1efe4
		'Ansi 15 Color': c(249, 248, 245),        // #f9f8f5
	},

	'One Dark': {
		'Background Color': c(40, 44, 52),        // #282c34
		'Foreground Color': c(171, 178, 191),     // #abb2bf
		'Bold Color': c(229, 192, 123),           // #e5c07b
		'Cursor Color': c(82, 139, 255),          // #528bff
		'Selection Color': c(62, 68, 81),         // #3e4451
		'Ansi 0 Color': c(84, 88, 98),            // #545862
		'Ansi 1 Color': c(224, 108, 117),         // #e06c75
		'Ansi 2 Color': c(152, 195, 121),         // #98c379
		'Ansi 3 Color': c(229, 192, 123),         // #e5c07b
		'Ansi 4 Color': c(97, 175, 239),          // #61afef
		'Ansi 5 Color': c(198, 120, 221),         // #c678dd
		'Ansi 6 Color': c(86, 182, 194),          // #56b6c2
		'Ansi 7 Color': c(220, 223, 228),         // #dcdfe4
		'Ansi 8 Color': c(84, 88, 98),            // #545862
		'Ansi 9 Color': c(224, 108, 117),         // #e06c75
		'Ansi 10 Color': c(152, 195, 121),        // #98c379
		'Ansi 11 Color': c(229, 192, 123),        // #e5c07b
		'Ansi 12 Color': c(97, 175, 239),         // #61afef
		'Ansi 13 Color': c(198, 120, 221),        // #c678dd
		'Ansi 14 Color': c(86, 182, 194),         // #56b6c2
		'Ansi 15 Color': c(220, 223, 228),        // #dcdfe4
	},

	'Gruvbox Dark': {
		'Background Color': c(40, 40, 40),        // #282828
		'Foreground Color': c(235, 219, 178),     // #ebdbb2
		'Bold Color': c(251, 241, 199),           // #fbf1c7
		'Cursor Color': c(235, 219, 178),         // #ebdbb2
		'Selection Color': c(80, 73, 69),         // #504945
		'Ansi 0 Color': c(40, 40, 40),            // #282828
		'Ansi 1 Color': c(204, 36, 29),           // #cc241d
		'Ansi 2 Color': c(152, 151, 26),          // #98971a
		'Ansi 3 Color': c(215, 153, 33),          // #d79921
		'Ansi 4 Color': c(69, 133, 136),          // #458588
		'Ansi 5 Color': c(177, 98, 134),          // #b16286
		'Ansi 6 Color': c(104, 157, 106),         // #689d6a
		'Ansi 7 Color': c(168, 153, 132),         // #a89984
		'Ansi 8 Color': c(146, 131, 116),         // #928374
		'Ansi 9 Color': c(251, 73, 52),           // #fb4934
		'Ansi 10 Color': c(184, 187, 38),         // #b8bb26
		'Ansi 11 Color': c(250, 189, 47),         // #fabd2f
		'Ansi 12 Color': c(131, 165, 152),        // #83a598
		'Ansi 13 Color': c(211, 134, 155),        // #d3869b
		'Ansi 14 Color': c(142, 192, 124),        // #8ec07c
		'Ansi 15 Color': c(235, 219, 178),        // #ebdbb2
	},

	'Tokyo Night': {
		'Background Color': c(26, 27, 38),        // #1a1b26
		'Foreground Color': c(192, 202, 245),     // #c0caf5
		'Bold Color': c(192, 202, 245),           // #c0caf5
		'Cursor Color': c(192, 202, 245),         // #c0caf5
		'Selection Color': c(51, 70, 124),        // #33467c
		'Ansi 0 Color': c(21, 22, 30),            // #15161e
		'Ansi 1 Color': c(247, 118, 142),         // #f7768e
		'Ansi 2 Color': c(158, 206, 106),         // #9ece6a
		'Ansi 3 Color': c(224, 175, 104),         // #e0af68
		'Ansi 4 Color': c(122, 162, 247),         // #7aa2f7
		'Ansi 5 Color': c(187, 154, 247),         // #bb9af7
		'Ansi 6 Color': c(125, 207, 255),         // #7dcfff
		'Ansi 7 Color': c(169, 177, 214),         // #a9b1d6
		'Ansi 8 Color': c(65, 72, 104),           // #414868
		'Ansi 9 Color': c(247, 118, 142),         // #f7768e
		'Ansi 10 Color': c(158, 206, 106),        // #9ece6a
		'Ansi 11 Color': c(224, 175, 104),        // #e0af68
		'Ansi 12 Color': c(122, 162, 247),        // #7aa2f7
		'Ansi 13 Color': c(187, 154, 247),        // #bb9af7
		'Ansi 14 Color': c(125, 207, 255),        // #7dcfff
		'Ansi 15 Color': c(192, 202, 245),        // #c0caf5
	},

	'Catppuccin Mocha': {
		'Background Color': c(30, 30, 46),        // #1e1e2e
		'Foreground Color': c(205, 214, 244),     // #cdd6f4
		'Bold Color': c(205, 214, 244),           // #cdd6f4
		'Cursor Color': c(245, 224, 220),         // #f5e0dc
		'Selection Color': c(88, 91, 112),        // #585b70
		'Ansi 0 Color': c(69, 71, 90),            // #45475a
		'Ansi 1 Color': c(243, 139, 168),         // #f38ba8
		'Ansi 2 Color': c(166, 227, 161),         // #a6e3a1
		'Ansi 3 Color': c(249, 226, 175),         // #f9e2af
		'Ansi 4 Color': c(137, 180, 250),         // #89b4fa
		'Ansi 5 Color': c(245, 194, 231),         // #f5c2e7
		'Ansi 6 Color': c(148, 226, 213),         // #94e2d5
		'Ansi 7 Color': c(186, 194, 222),         // #bac2de
		'Ansi 8 Color': c(88, 91, 112),           // #585b70
		'Ansi 9 Color': c(243, 139, 168),         // #f38ba8
		'Ansi 10 Color': c(166, 227, 161),        // #a6e3a1
		'Ansi 11 Color': c(249, 226, 175),        // #f9e2af
		'Ansi 12 Color': c(137, 180, 250),        // #89b4fa
		'Ansi 13 Color': c(245, 194, 231),        // #f5c2e7
		'Ansi 14 Color': c(148, 226, 213),        // #94e2d5
		'Ansi 15 Color': c(166, 173, 200),        // #a6adc8
	},
};
