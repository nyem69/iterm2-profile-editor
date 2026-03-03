<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';

	let { children } = $props();

	let dark = $state(false);

	$effect(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			dark = true;
		}
		// Apply immediately
		document.documentElement.classList.toggle('dark', dark);
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
</script>

<div class="min-h-screen bg-background text-foreground">
	<header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center px-4">
			<h1 class="text-lg font-semibold">iTerm2 Profile Editor</h1>
			<div class="ml-auto">
				<Button variant="ghost" size="icon" onclick={toggleTheme} aria-label="Toggle dark mode">
					{#if dark}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
				</Button>
			</div>
		</div>
	</header>
	<main>
		{@render children()}
	</main>
</div>
