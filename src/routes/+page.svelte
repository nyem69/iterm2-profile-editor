<script lang="ts">
	import { profileStore } from '$lib/stores/profiles.svelte';
	import UploadZone from '$lib/components/UploadZone.svelte';
	import ProfileList from '$lib/components/ProfileList.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { ITerm2ProfilesFile } from '$lib/types/profile';
	import Upload from '@lucide/svelte/icons/upload';
	import Palette from '@lucide/svelte/icons/palette';
	import Download from '@lucide/svelte/icons/download';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Layers from '@lucide/svelte/icons/layers';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy from '@lucide/svelte/icons/copy';

	let hasLocalData = $state(false);

	$effect(() => {
		hasLocalData = localStorage.getItem('iterm2-profile-editor') !== null;
	});

	$effect(() => {
		if (profileStore.profiles.length > 0) {
			const handler = (e: BeforeUnloadEvent) => {
				e.preventDefault();
			};
			window.addEventListener('beforeunload', handler);
			return () => window.removeEventListener('beforeunload', handler);
		}
	});

	function handleLoad(data: ITerm2ProfilesFile) {
		profileStore.load(data);
	}

	function handleRestore() {
		profileStore.restoreFromLocalStorage();
	}

	function handleClear() {
		profileStore.clearLocalStorage();
		hasLocalData = false;
	}
</script>

{#if profileStore.profiles.length === 0}
	<div class="mx-auto max-w-3xl px-4 py-8">
		<!-- Hero -->
		<div class="text-center mb-8">
			<h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Edit your iTerm2 profiles visually</h2>
			<p class="mt-3 text-muted-foreground max-w-lg mx-auto">
				Upload your iTerm2 Dynamic Profiles JSON, preview color themes, edit settings, and download the updated file. Everything runs in your browser.
			</p>
		</div>

		<!-- Upload zone -->
		<UploadZone onload={handleLoad} />

		{#if hasLocalData}
			<div class="mt-6 w-full max-w-md mx-auto rounded-lg border bg-muted/50 px-6 py-4 text-center">
				<p class="text-sm font-medium">You have previously saved profiles</p>
				<p class="mt-1 text-xs text-muted-foreground">Would you like to restore them?</p>
				<div class="mt-3 flex items-center justify-center gap-3">
					<Button variant="default" size="sm" onclick={handleRestore}>
						Restore
					</Button>
					<Button variant="outline" size="sm" onclick={handleClear}>
						Clear
					</Button>
				</div>
			</div>
		{/if}

		<Separator class="my-12" />

		<!-- How it works -->
		<section class="mb-12">
			<h3 class="text-lg font-semibold text-center mb-6">How it works</h3>
			<div class="grid gap-6 sm:grid-cols-3">
				<div class="flex flex-col items-center text-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Upload class="h-6 w-6 text-primary" />
					</div>
					<div>
						<p class="font-medium">1. Upload</p>
						<p class="text-sm text-muted-foreground mt-1">
							Drop your iTerm2 Dynamic Profiles JSON file or browse to select it
						</p>
					</div>
				</div>
				<div class="flex flex-col items-center text-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Pencil class="h-6 w-6 text-primary" />
					</div>
					<div>
						<p class="font-medium">2. Edit</p>
						<p class="text-sm text-muted-foreground mt-1">
							Modify colors, apply theme presets, change settings, update commands
						</p>
					</div>
				</div>
				<div class="flex flex-col items-center text-center gap-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
						<Download class="h-6 w-6 text-primary" />
					</div>
					<div>
						<p class="font-medium">3. Download</p>
						<p class="text-sm text-muted-foreground mt-1">
							Export your modified profiles as a JSON file ready for iTerm2
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Features -->
		<section class="mb-12">
			<h3 class="text-lg font-semibold text-center mb-6">Features</h3>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="flex gap-3 rounded-lg border p-4">
					<Palette class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p class="font-medium text-sm">Color theme presets</p>
						<p class="text-xs text-muted-foreground mt-1">
							Apply Dracula, Solarized, Nord, Monokai, and more with one click. Customize individual colors.
						</p>
					</div>
				</div>
				<div class="flex gap-3 rounded-lg border p-4">
					<Layers class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p class="font-medium text-sm">Bulk operations</p>
						<p class="text-xs text-muted-foreground mt-1">
							Select multiple profiles to apply themes, add tags, or delete in batch.
						</p>
					</div>
				</div>
				<div class="flex gap-3 rounded-lg border p-4">
					<Copy class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p class="font-medium text-sm">Add, copy & organize</p>
						<p class="text-xs text-muted-foreground mt-1">
							Create new profiles, duplicate existing ones, manage tags, and edit commands.
						</p>
					</div>
				</div>
				<div class="flex gap-3 rounded-lg border p-4">
					<ShieldCheck class="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
					<div>
						<p class="font-medium text-sm">Credential masking</p>
						<p class="text-xs text-muted-foreground mt-1">
							Passwords in commands are automatically masked in previews. No data leaves your browser.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Privacy -->
		<section class="mb-12">
			<div class="rounded-lg border bg-muted/30 p-6">
				<div class="flex items-start gap-3">
					<ShieldCheck class="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
					<div>
						<h3 class="font-semibold">Your data stays private</h3>
						<ul class="mt-2 space-y-1.5 text-sm text-muted-foreground">
							<li>All processing happens entirely in your browser. No server, no uploads, no tracking.</li>
							<li>Your profiles are saved to browser localStorage for convenience. Nothing is sent anywhere.</li>
							<li>Passwords and tokens in commands are masked with asterisks in preview cards.</li>
							<li>This tool is open source under the AGPLv3 license. You can audit the code yourself.</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- How to get your JSON -->
		<section class="mb-8">
			<h3 class="text-lg font-semibold text-center mb-4">Where to find your profiles JSON</h3>
			<div class="rounded-lg border p-4 text-sm space-y-3">
				<div>
					<p class="font-medium">Export from iTerm2:</p>
					<p class="text-muted-foreground mt-1">
						iTerm2 &rarr; Settings &rarr; Profiles &rarr; Other Actions &rarr; Save All Profiles as JSON
					</p>
				</div>
				<Separator />
				<div>
					<p class="font-medium">Dynamic Profiles folder:</p>
					<code class="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
						~/Library/Application Support/iTerm2/DynamicProfiles/
					</code>
				</div>
				<Separator />
				<div>
					<p class="font-medium">Converting from Terminal.app:</p>
					<p class="text-muted-foreground mt-1">
						Use the Python conversion script to export Terminal.app profiles to iTerm2 format first, then upload the resulting JSON here.
					</p>
				</div>
			</div>
		</section>
	</div>
{:else}
	<ProfileList />
{/if}
