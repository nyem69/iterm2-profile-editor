<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-background text-foreground">
	<header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-14 items-center px-4">
			<h1 class="text-lg font-semibold">iTerm2 Profile Editor</h1>
		</div>
	</header>
	<main>
		{@render children()}
	</main>
</div>
