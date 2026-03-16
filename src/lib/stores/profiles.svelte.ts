import type { ITerm2Profile, ITerm2ProfilesFile, ITerm2Color, ColorKey } from '$lib/types/profile';
import { ALL_COLOR_KEYS } from '$lib/types/profile';
import { COLOR_PRESETS } from '$lib/data/color-presets';

const STORAGE_KEY = 'iterm2-profile-editor';
const MAX_PROFILES = 1000;

function validateProfiles(profiles: ITerm2Profile[]): ITerm2Profile[] {
	return profiles
		.filter((p) => typeof p.Name === 'string' && p.Name.length > 0)
		.map((p) => {
			if (typeof p.Guid !== 'string' || p.Guid.length === 0) {
				return { ...p, Guid: crypto.randomUUID().toUpperCase() };
			}
			return p;
		})
		.slice(0, MAX_PROFILES);
}

class ProfileStore {
	profiles = $state<ITerm2Profile[]>([]);
	selectedIds = $state<Set<string>>(new Set());
	searchQuery = $state('');
	filterTag = $state<string | null>(null);
	hasUnsavedData = $state(false);
	saveError = $state<string | null>(null);
	initialized = $state(false);

	private _saveTimer: ReturnType<typeof setTimeout> | undefined;

	/** All unique tags across profiles */
	get allTags(): string[] {
		const tags = new Set<string>();
		for (const p of this.profiles) {
			for (const t of p.Tags ?? []) tags.add(t);
		}
		return [...tags].sort();
	}

	/** Profiles filtered by search and tag */
	get filtered(): ITerm2Profile[] {
		let result = this.profiles;
		if (this.filterTag) {
			result = result.filter((p) => p.Tags?.includes(this.filterTag!));
		}
		if (this.searchQuery) {
			const q = this.searchQuery.toLowerCase();
			result = result.filter(
				(p) =>
					p.Name.toLowerCase().includes(q) ||
					p.Command?.toLowerCase().includes(q) ||
					p.Tags?.some((t) => t.toLowerCase().includes(q))
			);
		}
		return result;
	}

	/** Profiles grouped by first tag (or "Untagged") */
	get grouped(): Map<string, ITerm2Profile[]> {
		const groups = new Map<string, ITerm2Profile[]>();
		for (const p of this.filtered) {
			const tag = p.Tags?.[0] ?? 'Untagged';
			if (!groups.has(tag)) groups.set(tag, []);
			groups.get(tag)!.push(p);
		}
		return groups;
	}

	/** Get a single profile by GUID */
	getByGuid(guid: string): ITerm2Profile | undefined {
		return this.profiles.find((p) => p.Guid === guid);
	}

	/** Load profiles from JSON */
	load(data: ITerm2ProfilesFile) {
		this.profiles = validateProfiles(data.Profiles);
		this.selectedIds = new Set();
		this.hasUnsavedData = true;
		this.saveToLocalStorage();
		this.initialized = true;
	}

	/** Add a new profile */
	add(presetName?: string) {
		const guid = crypto.randomUUID().toUpperCase();
		const profile: ITerm2Profile = {
			Name: 'New Profile',
			Guid: guid,
			'Custom Command': 'No',
		};
		if (presetName && COLOR_PRESETS[presetName]) {
			const preset = COLOR_PRESETS[presetName];
			for (const key of ALL_COLOR_KEYS) {
				if (preset[key]) {
					(profile as Record<string, unknown>)[key] = { ...preset[key] };
				}
			}
		}
		this.profiles.push(profile);
		this.saveToLocalStorage();
		return guid;
	}

	/** Duplicate a profile */
	copy(guid: string) {
		const source = this.getByGuid(guid);
		if (!source) return;
		const newGuid = crypto.randomUUID().toUpperCase();
		const copy: ITerm2Profile = JSON.parse(JSON.stringify(source));
		copy.Guid = newGuid;
		copy.Name = `${source.Name} (copy)`;
		const idx = this.profiles.indexOf(source);
		this.profiles.splice(idx + 1, 0, copy);
		this.saveToLocalStorage();
		return newGuid;
	}

	/** Delete a profile */
	delete(guid: string) {
		const idx = this.profiles.findIndex((p) => p.Guid === guid);
		if (idx !== -1) {
			this.profiles.splice(idx, 1);
			this.selectedIds.delete(guid);
			this.selectedIds = new Set(this.selectedIds);
			this.saveToLocalStorage();
		}
	}

	/** Update profile fields */
	update(guid: string, changes: Partial<ITerm2Profile>) {
		const profile = this.getByGuid(guid);
		if (!profile) return;
		for (const [key, value] of Object.entries(changes)) {
			if (value === undefined) {
				delete (profile as Record<string, unknown>)[key];
			} else {
				(profile as Record<string, unknown>)[key] = value;
			}
		}
		this._debouncedSave();
	}

	/** Set a single color on a profile */
	setColor(guid: string, key: ColorKey, color: ITerm2Color) {
		const profile = this.getByGuid(guid);
		if (!profile) return;
		(profile as Record<string, unknown>)[key] = color;
		this._debouncedSave();
	}

	/** Apply a color preset to a profile */
	applyTheme(guid: string, presetName: string) {
		const preset = COLOR_PRESETS[presetName];
		if (!preset) return;
		const profile = this.getByGuid(guid);
		if (!profile) return;
		for (const key of ALL_COLOR_KEYS) {
			if (preset[key]) {
				(profile as Record<string, unknown>)[key] = { ...preset[key] };
			}
		}
		this._debouncedSave();
	}

	// --- Bulk operations ---

	toggleSelect(guid: string) {
		if (this.selectedIds.has(guid)) {
			this.selectedIds.delete(guid);
		} else {
			this.selectedIds.add(guid);
		}
		// Trigger reactivity
		this.selectedIds = new Set(this.selectedIds);
	}

	selectAll() {
		this.selectedIds = new Set(this.filtered.map((p) => p.Guid));
	}

	deselectAll() {
		this.selectedIds = new Set();
	}

	bulkDelete() {
		this.profiles = this.profiles.filter((p) => !this.selectedIds.has(p.Guid));
		this.selectedIds = new Set();
		this.saveToLocalStorage();
	}

	bulkApplyTags(tags: string[]) {
		for (const p of this.profiles) {
			if (this.selectedIds.has(p.Guid)) {
				const existing = new Set(p.Tags ?? []);
				for (const t of tags) existing.add(t);
				p.Tags = [...existing];
			}
		}
		this.selectedIds = new Set();
		this.saveToLocalStorage();
	}

	bulkApplyTheme(presetName: string) {
		const preset = COLOR_PRESETS[presetName];
		if (!preset) return;
		for (const guid of this.selectedIds) {
			const profile = this.getByGuid(guid);
			if (!profile) continue;
			for (const key of ALL_COLOR_KEYS) {
				if (preset[key]) {
					(profile as Record<string, unknown>)[key] = { ...preset[key] };
				}
			}
		}
		this.selectedIds = new Set();
		this.saveToLocalStorage();
	}

	// --- Persistence ---

	private _debouncedSave() {
		if (this._saveTimer) clearTimeout(this._saveTimer);
		this._saveTimer = setTimeout(() => {
			this.saveToLocalStorage();
		}, 500);
	}

	saveToLocalStorage() {
		this.hasUnsavedData = true;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ Profiles: this.profiles }));
			this.saveError = null;
		} catch (e) {
			this.saveError = e instanceof Error ? e.message : 'Failed to save to localStorage';
		}
	}

	restoreFromLocalStorage(): boolean {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				this.initialized = true;
				return false;
			}
			const data = JSON.parse(raw) as ITerm2ProfilesFile;
			if (data.Profiles?.length > 0) {
				this.profiles = validateProfiles(data.Profiles);
				this.hasUnsavedData = true;
				this.initialized = true;
				return true;
			}
		} catch {
			// corrupt data
		}
		this.initialized = true;
		return false;
	}

	clearLocalStorage() {
		localStorage.removeItem(STORAGE_KEY);
		this.profiles = [];
		this.selectedIds = new Set();
		this.hasUnsavedData = false;
	}

	// --- Export ---

	toJSON(): ITerm2ProfilesFile {
		return { Profiles: this.profiles };
	}

	downloadJSON() {
		const blob = new Blob([JSON.stringify(this.toJSON(), null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'iterm2-profiles.json';
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
}

export const profileStore = new ProfileStore();
