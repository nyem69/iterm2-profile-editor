<script lang="ts">
	import { profileStore } from '$lib/stores/profiles.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';

	let { guid }: { guid: string } = $props();

	let profile = $derived(profileStore.getByGuid(guid));

	// Local state for tag input
	let tagInput = $state('');
	let nameEmpty = $state(false);

	// Derived values for bound inputs
	let name = $derived(profile?.Name ?? '');
	let normalFont = $derived(profile?.['Normal Font'] ?? '');
	let columns = $derived(profile?.Columns ?? 80);
	let rows = $derived(profile?.Rows ?? 24);
	let scrollbackLines = $derived(profile?.['Scrollback Lines'] ?? 1000);
	let unlimitedScrollback = $derived(profile?.['Unlimited Scrollback'] ?? false);
	let cursorType = $derived(String(profile?.['Cursor Type'] ?? 0));
	let blinkingCursor = $derived(profile?.['Blinking Cursor'] ?? false);
	let silenceBell = $derived(profile?.['Silence Bell'] ?? false);
	let visualBell = $derived(profile?.['Visual Bell'] ?? false);
	let antiAliased = $derived(profile?.['ASCII Anti Aliased'] ?? true);
	let optionKeySends = $derived(String(profile?.['Option Key Sends'] ?? 0));
	let transparency = $derived(profile?.Transparency ?? 0);

	let tags = $derived(profile?.Tags ?? []);

	function updateField(changes: Record<string, unknown>) {
		profileStore.update(guid, changes);
	}

	function handleTagBlur() {
		if (!tagInput.trim()) return;
		const newTags = tagInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);
		const merged = [...new Set([...tags, ...newTags])];
		updateField({ Tags: merged });
		tagInput = '';
	}

	function removeTag(tag: string) {
		const updated = tags.filter((t) => t !== tag);
		updateField({ Tags: updated });
	}
</script>

{#if profile}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Name -->
		<div class="space-y-2 md:col-span-2">
			<Label for="profile-name">Name</Label>
			<Input
				id="profile-name"
				type="text"
				value={name}
				class={nameEmpty ? 'border-red-500' : ''}
				oninput={(e) => {
					const val = e.currentTarget.value;
					nameEmpty = val.trim() === '';
					updateField({ Name: val });
				}}
				onblur={(e) => {
					if (e.currentTarget.value.trim() === '') {
						updateField({ Name: 'Untitled' });
						nameEmpty = false;
					}
				}}
			/>
			{#if nameEmpty}
				<p class="text-xs text-red-500">Name cannot be empty. It will be set to "Untitled" on blur.</p>
			{/if}
		</div>

		<!-- Tags -->
		<div class="space-y-2 md:col-span-2">
			<Label for="profile-tags">Tags</Label>
			{#if tags.length > 0}
				<div class="flex flex-wrap gap-1.5 mb-2">
					{#each tags as tag}
						<Badge variant="secondary" class="gap-1">
							{tag}
							<button
								type="button"
								class="ml-0.5 hover:text-destructive cursor-pointer"
								onclick={() => removeTag(tag)}
							>
								x
							</button>
						</Badge>
					{/each}
				</div>
			{/if}
			<Input
				id="profile-tags"
				type="text"
				placeholder="Add tags (comma-separated, press Tab or click away)"
				bind:value={tagInput}
				onblur={handleTagBlur}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						handleTagBlur();
					}
				}}
			/>
		</div>

		<Separator class="md:col-span-2" />

		<!-- Normal Font -->
		<div class="space-y-2">
			<Label for="normal-font">Normal Font</Label>
			<Input
				id="normal-font"
				type="text"
				placeholder="MesloLGS-NF-Regular 13"
				value={normalFont}
				oninput={(e) => updateField({ 'Normal Font': e.currentTarget.value })}
			/>
		</div>

		<!-- Anti-Aliased -->
		<div class="flex items-center justify-between gap-4">
			<Label for="anti-aliased">Anti-Aliased</Label>
			<Switch
				id="anti-aliased"
				checked={antiAliased}
				onCheckedChange={(checked) =>
					updateField({
						'ASCII Anti Aliased': checked,
						'Non-ASCII Anti Aliased': checked
					})}
			/>
		</div>

		<Separator class="md:col-span-2" />

		<!-- Columns -->
		<div class="space-y-2">
			<Label for="columns">Columns</Label>
			<Input
				id="columns"
				type="number"
				min={1}
				max={999}
				value={columns}
				oninput={(e) => {
					const val = Number(e.currentTarget.value);
					if (isNaN(val) || e.currentTarget.value === '') return;
					updateField({ Columns: Math.min(999, Math.max(1, val)) });
				}}
			/>
		</div>

		<!-- Rows -->
		<div class="space-y-2">
			<Label for="rows">Rows</Label>
			<Input
				id="rows"
				type="number"
				min={1}
				max={999}
				value={rows}
				oninput={(e) => {
					const val = Number(e.currentTarget.value);
					if (isNaN(val) || e.currentTarget.value === '') return;
					updateField({ Rows: Math.min(999, Math.max(1, val)) });
				}}
			/>
		</div>

		<!-- Scrollback Lines -->
		<div class="space-y-2">
			<Label for="scrollback-lines">Scrollback Lines</Label>
			<Input
				id="scrollback-lines"
				type="number"
				min={0}
				max={100000}
				value={scrollbackLines}
				disabled={unlimitedScrollback}
				oninput={(e) => {
					const val = Number(e.currentTarget.value);
					if (isNaN(val) || e.currentTarget.value === '') return;
					updateField({ 'Scrollback Lines': Math.min(100000, Math.max(0, val)) });
				}}
			/>
		</div>

		<!-- Unlimited Scrollback -->
		<div class="flex items-center justify-between gap-4">
			<Label for="unlimited-scrollback">Unlimited Scrollback</Label>
			<Switch
				id="unlimited-scrollback"
				checked={unlimitedScrollback}
				onCheckedChange={(checked) => updateField({ 'Unlimited Scrollback': checked })}
			/>
		</div>

		<Separator class="md:col-span-2" />

		<!-- Cursor Type -->
		<div class="space-y-2">
			<Label>Cursor Type</Label>
			<Select.Root
				type="single"
				value={cursorType}
				onValueChange={(val) => updateField({ 'Cursor Type': Number(val) })}
			>
				<Select.Trigger class="w-full">
					{cursorType === '0' ? 'Underline' : cursorType === '1' ? 'Vertical Bar' : 'Box'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="0" label="Underline" />
					<Select.Item value="1" label="Vertical Bar" />
					<Select.Item value="2" label="Box" />
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Blinking Cursor -->
		<div class="flex items-center justify-between gap-4">
			<Label for="blinking-cursor">Blinking Cursor</Label>
			<Switch
				id="blinking-cursor"
				checked={blinkingCursor}
				onCheckedChange={(checked) => updateField({ 'Blinking Cursor': checked })}
			/>
		</div>

		<Separator class="md:col-span-2" />

		<!-- Silence Bell -->
		<div class="flex items-center justify-between gap-4">
			<Label for="silence-bell">Silence Bell</Label>
			<Switch
				id="silence-bell"
				checked={silenceBell}
				onCheckedChange={(checked) => updateField({ 'Silence Bell': checked })}
			/>
		</div>

		<!-- Visual Bell -->
		<div class="flex items-center justify-between gap-4">
			<Label for="visual-bell">Visual Bell</Label>
			<Switch
				id="visual-bell"
				checked={visualBell}
				onCheckedChange={(checked) => updateField({ 'Visual Bell': checked })}
			/>
		</div>

		<Separator class="md:col-span-2" />

		<!-- Option Key Sends -->
		<div class="space-y-2">
			<Label>Option Key Sends</Label>
			<Select.Root
				type="single"
				value={optionKeySends}
				onValueChange={(val) => updateField({ 'Option Key Sends': Number(val) })}
			>
				<Select.Trigger class="w-full">
					{optionKeySends === '0' ? 'Normal' : 'Esc+'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="0" label="Normal" />
					<Select.Item value="2" label="Esc+" />
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Transparency -->
		<div class="space-y-2">
			<Label for="transparency">Transparency: {Math.round(transparency * 100)}%</Label>
			<input
				id="transparency"
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={transparency}
				oninput={(e) => updateField({ Transparency: Number(e.currentTarget.value) })}
				class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
			/>
		</div>
	</div>
{/if}
