<script lang="ts">
	import type { ITerm2Color } from '$lib/types/profile';
	import { colorToHex, colorToCSS, hexToColor } from '$lib/utils/color';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	let { label, color, onchange }: {
		label: string;
		color: ITerm2Color | undefined;
		onchange: (color: ITerm2Color) => void;
	} = $props();

	let colorInput: HTMLInputElement | null = $state(null);

	let hexValue = $derived(color ? colorToHex(color) : '#000000');
	let cssColor = $derived(color ? colorToCSS(color) : undefined);

	function handleClick() {
		colorInput?.click();
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const newColor = hexToColor(target.value, color?.['Alpha Component'] ?? 1, color?.['Color Space'] ?? 'sRGB');
		onchange(newColor);
	}
</script>

<div class="flex flex-col items-center gap-1">
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button
				type="button"
				class="w-10 h-10 md:w-12 md:h-12 rounded-md cursor-pointer transition-shadow hover:ring-2 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring outline-none {color ? '' : 'border-2 border-dashed border-muted-foreground/40 bg-muted'}"
				style={cssColor ? `background-color: ${cssColor}` : undefined}
				onclick={handleClick}
			>
				<span class="sr-only">Edit {label} color</span>
			</button>
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content>
				<p>{hexValue}</p>
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
	<span class="text-xs text-muted-foreground truncate w-10 md:w-12 text-center">{label}</span>
	<input
		bind:this={colorInput}
		type="color"
		value={hexValue}
		oninput={handleInput}
		class="sr-only"
		tabindex={-1}
	/>
</div>
