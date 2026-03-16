<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Github from '@lucide/svelte/icons/github';
	import { profileStore } from '$lib/stores/profiles.svelte';

	let { children } = $props();

	let dark = $state(false);

	$effect(() => {
		profileStore.restoreFromLocalStorage();
	});

	// Initialize once
	$effect(() => {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			dark = true;
		}
	});
	// Sync to DOM whenever dark changes
	$effect(() => {
		document.documentElement.classList.toggle('dark', dark);
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
</script>

<Tooltip.Provider>
	<div class="min-h-screen bg-background text-foreground">
		<header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div class="container flex h-14 items-center px-4">
				<a href="/" class="text-lg font-semibold hover:opacity-80">iTerm2 Profile Editor</a>
				<div class="ml-auto flex items-center">
					<Button variant="ghost" size="icon" href="https://github.com/nyem69/iterm2-profile-editor" target="_blank" aria-label="GitHub repository">
						<Github class="h-5 w-5" />
					</Button>
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
	<Toaster richColors position="bottom-right" />
</Tooltip.Provider>
