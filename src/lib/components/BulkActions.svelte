<script lang="ts">
	import { profileStore } from '$lib/stores/profiles.svelte';
	import { COLOR_PRESETS } from '$lib/data/color-presets';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Palette from '@lucide/svelte/icons/palette';
	import Tags from '@lucide/svelte/icons/tags';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import X from '@lucide/svelte/icons/x';
	import { toast } from 'svelte-sonner';

	let deleteDialogOpen = $state(false);
	let tagDialogOpen = $state(false);
	let tagInput = $state('');

	let selectedCount = $derived(profileStore.selectedIds.size);
	let allFilteredSelected = $derived(
		profileStore.filtered.length > 0 &&
			profileStore.filtered.every((p) => profileStore.selectedIds.has(p.Guid))
	);

	function handleToggleSelectAll() {
		if (allFilteredSelected) {
			profileStore.deselectAll();
		} else {
			profileStore.selectAll();
		}
	}

	function handleConfirmDelete() {
		const count = profileStore.selectedIds.size;
		profileStore.bulkDelete();
		deleteDialogOpen = false;
		toast.success(`Deleted ${count} profile(s)`);
	}

	function handleApplyTags() {
		const tags = tagInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);
		if (tags.length > 0) {
			const count = profileStore.selectedIds.size;
			profileStore.bulkApplyTags(tags);
			toast.success(`Added tags to ${count} profile(s)`);
		}
		tagInput = '';
		tagDialogOpen = false;
	}

	function handleApplyTheme(preset: string) {
		profileStore.bulkApplyTheme(preset);
		toast.success(`Applied ${preset} theme`);
	}
</script>

<!-- Sticky bottom bar -->
<div
	class="fixed inset-x-0 bottom-0 z-50 border-t bg-primary text-primary-foreground shadow-lg"
>
	<div class="container flex flex-wrap items-center gap-2 px-4 py-3 md:px-3 md:py-2">
		<!-- Selection count -->
		<span class="text-sm font-medium">
			{selectedCount} selected
		</span>

		<!-- Select All / Deselect All -->
		<Button
			variant="secondary"
			size="sm"
			onclick={handleToggleSelectAll}
			aria-label={allFilteredSelected ? 'Deselect all' : 'Select all'}
		>
			{#if allFilteredSelected}
				<X class="size-4" />
				<span class="hidden sm:inline">Deselect All</span>
			{:else}
				<CheckCheck class="size-4" />
				<span class="hidden sm:inline">Select All</span>
			{/if}
		</Button>

		<!-- Delete Selected -->
		<AlertDialog.Root bind:open={deleteDialogOpen}>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="destructive" size="sm" {...props} aria-label="Delete selected">
						<Trash2 class="size-4" />
						<span class="hidden sm:inline">Delete</span>
					</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Delete {selectedCount} profile{selectedCount !== 1 ? 's' : ''}?</AlertDialog.Title>
					<AlertDialog.Description>
						This cannot be undone. The selected profiles will be permanently removed.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action onclick={handleConfirmDelete}>Delete</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>

		<!-- Apply Theme dropdown -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="secondary" size="sm" {...props} aria-label="Apply theme">
						<Palette class="size-4" />
						<span class="hidden sm:inline">Apply Theme</span>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				{#each Object.keys(COLOR_PRESETS) as preset}
					<DropdownMenu.Item onclick={() => handleApplyTheme(preset)}>
						{preset}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<!-- Add Tags -->
		<Dialog.Root bind:open={tagDialogOpen}>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button variant="secondary" size="sm" {...props} aria-label="Add tags">
						<Tags class="size-4" />
						<span class="hidden sm:inline">Add Tags</span>
					</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Add Tags to {selectedCount} profile{selectedCount !== 1 ? 's' : ''}</Dialog.Title>
					<Dialog.Description>
						Enter comma-separated tags to add to the selected profiles.
					</Dialog.Description>
				</Dialog.Header>
				<div class="py-4">
					<Input
						type="text"
						placeholder="e.g. work, ssh, dev"
						bind:value={tagInput}
						onkeydown={(e: KeyboardEvent) => {
							if (e.key === 'Enter') handleApplyTags();
						}}
					/>
				</div>
				<Dialog.Footer>
					<Dialog.Close>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Cancel</Button>
						{/snippet}
					</Dialog.Close>
					<Button onclick={handleApplyTags}>Apply</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<!-- Deselect all (close) button on far right -->
		<Button
			variant="ghost"
			size="sm"
			class="ml-auto text-primary-foreground hover:text-primary-foreground/80 md:text-inherit"
			onclick={() => profileStore.deselectAll()}
		>
			<X class="size-4" />
		</Button>
	</div>
</div>
