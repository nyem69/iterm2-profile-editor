<script lang="ts">
	import { profileStore } from '$lib/stores/profiles.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let { guid }: { guid: string } = $props();

	let profile = $derived(profileStore.getByGuid(guid));

	let customCommand = $derived(profile?.['Custom Command'] === 'Yes');
	let command = $derived(profile?.Command ?? '');

	// Session close: -1 = don't close, 0 = close, undefined = default
	// We map to string for the Select component
	let sessionCloseValue = $derived(
		profile?.['Session Close Undo Timeout'] === undefined
			? 'default'
			: String(profile['Session Close Undo Timeout'])
	);

	// Use a readable label for session close
	function sessionCloseLabel(value: string): string {
		switch (value) {
			case '0':
				return 'Close window';
			case '-1':
				return "Don't close";
			default:
				return 'Default';
		}
	}

	function updateField(changes: Record<string, unknown>) {
		profileStore.update(guid, changes);
	}

	function toggleCustomCommand(checked: boolean) {
		if (checked) {
			updateField({ 'Custom Command': 'Yes' });
		} else {
			updateField({ 'Custom Command': 'No' });
		}
	}

	function handleSessionCloseChange(val: string) {
		if (val === 'default') {
			// Remove the key by setting undefined
			updateField({ 'Session Close Undo Timeout': undefined });
		} else {
			updateField({ 'Session Close Undo Timeout': Number(val) });
		}
	}
</script>

{#if profile}
	<div class="space-y-6 max-w-xl">
		<!-- Custom Command Toggle -->
		<div class="flex items-center justify-between gap-4">
			<div class="space-y-0.5">
				<Label for="custom-command">Custom Command</Label>
				<p class="text-xs text-muted-foreground">Run a custom command instead of the default shell</p>
			</div>
			<Switch
				id="custom-command"
				checked={customCommand}
				onCheckedChange={toggleCustomCommand}
			/>
		</div>

		<!-- Command Textarea -->
		{#if customCommand}
			<div class="space-y-2">
				<Label for="command-input">Command</Label>
				<Textarea
					id="command-input"
					value={command}
					rows={4}
					placeholder="/usr/local/bin/fish"
					class="font-mono"
					style="font-family: 'Geist Mono', monospace;"
					oninput={(e) => updateField({ Command: e.currentTarget.value })}
				/>
			</div>
		{/if}

		<Separator />

		<!-- Session Close Behavior -->
		<div class="space-y-2">
			<Label>Session Close Behavior</Label>
			<p class="text-xs text-muted-foreground mb-2">What happens when the session ends</p>
			<Select.Root
				type="single"
				value={sessionCloseValue}
				onValueChange={handleSessionCloseChange}
			>
				<Select.Trigger class="w-full sm:w-[220px]">
					{sessionCloseLabel(sessionCloseValue)}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="default" label="Default" />
					<Select.Item value="0" label="Close window" />
					<Select.Item value="-1" label="Don't close" />
				</Select.Content>
			</Select.Root>
		</div>
	</div>
{/if}
