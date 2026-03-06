<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { profileStore } from '$lib/stores/profiles.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { colorToCSS } from '$lib/utils/color';
	import { ANSI_COLOR_KEYS, ANSI_COLOR_NAMES } from '$lib/types/profile';
	import ColorEditor from '$lib/components/ColorEditor.svelte';
	import ProfileSettings from '$lib/components/ProfileSettings.svelte';
	import ProfileCommand from '$lib/components/ProfileCommand.svelte';

	let guid = $derived(page.params.guid ?? '');
	let profile = $derived(profileStore.getByGuid(guid));

	// Redirect if profile not found or no profiles loaded
	$effect(() => {
		if (!guid || !profile) {
			goto('/');
		}
	});

	let deleteDialogOpen = $state(false);

	function handleDelete() {
		profileStore.delete(guid);
		history.back();
	}

	function handleCopy() {
		const newGuid = profileStore.copy(guid);
		if (newGuid) {
			goto(`/profile/${newGuid}`);
		}
	}

	// Terminal preview colors
	let bgCSS = $derived(
		profile?.['Background Color'] ? colorToCSS(profile['Background Color']) : '#1e1e2e'
	);
	let fgCSS = $derived(
		profile?.['Foreground Color'] ? colorToCSS(profile['Foreground Color']) : '#cdd6f4'
	);

	function ansiCSS(index: number): string {
		if (!profile) return '#888';
		const key = ANSI_COLOR_KEYS[index];
		const color = profile[key];
		return color ? colorToCSS(color) : '#888';
	}
</script>

{#if profile}
	<div class="container px-4 py-4 max-w-4xl mx-auto">
		<!-- Top Bar -->
		<div class="flex items-center gap-3 mb-4">
			<Button variant="ghost" size="icon" onclick={() => history.back()}>
				<ArrowLeft class="h-5 w-5" />
				<span class="sr-only">Back</span>
			</Button>
			<h2 class="text-lg font-semibold truncate flex-1">{profile.Name}</h2>
			<Button variant="outline" size="icon" onclick={handleCopy}>
				<Copy class="h-4 w-4" />
				<span class="sr-only">Copy profile</span>
			</Button>

			<AlertDialog.Root bind:open={deleteDialogOpen}>
				<AlertDialog.Trigger
					class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 text-destructive hover:text-destructive cursor-pointer"
				>
					<Trash2 class="h-4 w-4" />
					<span class="sr-only">Delete profile</span>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Delete Profile</AlertDialog.Title>
						<AlertDialog.Description>
							Are you sure you want to delete "{profile.Name}"? This action cannot be undone.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<AlertDialog.Action onclick={handleDelete}>
							Delete
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>

		<!-- Live Terminal Preview Strip -->
		<div
			class="rounded-lg border overflow-hidden mb-6 font-mono text-xs sm:text-sm"
			style="background-color: {bgCSS}; color: {fgCSS}; font-family: 'Geist Mono', monospace;"
		>
			<div class="px-4 py-3 flex items-center gap-3 overflow-x-auto">
				<span class="whitespace-nowrap opacity-80">~$</span>
				<span class="whitespace-nowrap">The quick brown fox jumps over the lazy dog</span>
				<span class="mx-2 opacity-30">|</span>
				<div class="flex gap-1 shrink-0">
					{#each { length: 16 } as _, i}
						<span
							class="w-4 h-4 sm:w-5 sm:h-5 rounded-sm inline-block shrink-0"
							style="background-color: {ansiCSS(i)};"
							title={ANSI_COLOR_NAMES[i]}
						></span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<Tabs value="colors" class="w-full">
			<TabsList class="w-full grid grid-cols-3 mb-6">
				<TabsTrigger value="colors">Colors</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
				<TabsTrigger value="command">Command</TabsTrigger>
			</TabsList>

			<TabsContent value="colors">
				<ColorEditor {guid} />
			</TabsContent>

			<TabsContent value="settings">
				<ProfileSettings {guid} />
			</TabsContent>

			<TabsContent value="command">
				<ProfileCommand {guid} />
			</TabsContent>
		</Tabs>
	</div>
{/if}
