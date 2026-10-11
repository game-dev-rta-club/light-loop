# Contributing

Keep Light Loop small. Improve the goal-driven method and its explanation without adding a controller, a fixed task sequence or a growing list of rules for individual failures.

Open an issue first for changes to the loop principles or Goal compatibility. For behavioral changes, include a realistic request and the observed turn results; static checks alone cannot prove that an agent follows the method well.

## Development

Edit `skills/light-loop/` directly. `SKILL.md` is the source of truth for the method. The Claude Code plugin beside it (`.claude-plugin/`, `hooks/`, `types/`) only gives Claude Code Codex-style goal tools; keep it to that. Use Node.js 24+ to run the repository checks:

```sh
npm test
```

Check the plugin with Claude Code itself:

```sh
claude plugin validate skills/light-loop
claude plugin test skills/light-loop
```

No dependency installation or build is needed. CI checks the skill's packaging and local documentation links on macOS, Windows and Linux; it does not simulate Codex Goal execution.

## Releases

Use SemVer in `package.json` for skill releases, including documentation updates:

1. Update the version and `CHANGELOG.md`.
2. Run the checks and review the skill changes.
3. Commit and push main, then create an immutable `v<version>` tag.
4. CI publishes a GitHub release after the checks pass. Verify installation from that tag.

Never move a published tag. GitHub hosts the skill; there is no npm package or runtime to publish. Installed projects update explicitly with the installer.

## Pull requests

Explain the outcome and checks performed. Concise commit messages in English or Japanese are welcome. Do not include credentials, private project data or task histories.

Contributions are licensed under this repository's MIT license. No CLA or DCO is required.
