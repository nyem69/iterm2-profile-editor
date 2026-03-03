/**
 * Mask credentials in command strings for display purposes.
 * Replaces passwords, tokens, and other sensitive values with asterisks.
 */
export function maskCommand(command: string): string {
	let masked = command;

	// MySQL -p flag: -pPASSWORD (inline password, no space)
	// Only match standalone -p flag (preceded by space/start), not part of --long-flags
	// Matches: -pDB@zmi123, -pAVNS_xxx, -pclaude#@!
	// Does NOT match: --skip-permissions, --dangerously-skip-permissions
	masked = masked.replace(/(^|\s)-p([^\s-][^\s]*)/g, '$1-p****');

	// MySQL --password= or -password= variations
	masked = masked.replace(/(--?password[=:]\s*)([^\s]+)/gi, '$1****');

	// Generic -u flag followed by value (usernames are less sensitive but still mask for consistency)
	// Actually, usernames are useful context — only mask passwords

	// AVNS_ tokens (Aiven service tokens)
	masked = masked.replace(/AVNS_[A-Za-z0-9_-]+/g, 'AVNS_****');

	// SSH private key paths (not really in these commands but future-proofing)
	masked = masked.replace(/(-i\s+)([^\s]+)/g, '$1****');

	// Generic patterns: PASSWORD=xxx, SECRET=xxx, TOKEN=xxx, KEY=xxx, API_KEY=xxx
	masked = masked.replace(
		/(PASSWORD|SECRET|TOKEN|API_KEY|PRIVATE_KEY|ACCESS_KEY)[=:]\s*([^\s]+)/gi,
		'$1=****'
	);

	// Bearer tokens
	masked = masked.replace(/(Bearer\s+)([^\s]+)/gi, '$1****');

	// URLs with embedded credentials: user:pass@host
	masked = masked.replace(/:([^/\s@]{2,})@/g, ':****@');

	return masked;
}
