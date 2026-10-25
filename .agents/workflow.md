# Delivery workflow

## Branch model

- `development` is the integration branch. Start feature work from it; do not work directly on it.
- `staging` is the pre-release validation branch. Promote to it from `development` when staging validation is requested.
- `main` is the stable release branch. Promote to it from validated `staging` only when a release is requested.
- Use one intent-specific local branch per change, such as `feat/<name>`, `fix/<name>`, or `chore/<name>`.
- Keep work local by default. Do not push, open pull requests, or publish a release unless the user explicitly requests remote delivery.

## Commit message convention

Use Conventional Commits: `<type>(<scope>): <imperative summary>` (omit an unnecessary scope). Use a concise subject, followed by a blank line and `-` bullets describing what changed and why. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`. For breaking changes, append `!` and include a `BREAKING CHANGE:` footer.

Pull-request titles use the same convention. For reviewed PR merges, preserve individual commits with a merge commit rather than squashing them.

## Local loop (default)

Run this loop for retained work:

1. **Inspect** — check the current branch and working tree. Preserve unrelated changes; never reset, discard, overwrite, or stage them. If they prevent safe work, stop and report it.
2. **Branch** — start from local `development` and create one intent-specific branch. If a matching remote `development` exists, fast-forward from it first; do not try to pull a remote branch that does not exist.
3. **Implement** — read applicable instructions, make the smallest complete change, and run the narrowest relevant checks. Use the package manager and scripts declared by the root configuration. Before changing Turborepo configuration or commands, follow the Turborepo-specific guidance in `AGENTS.md` and the installed package's documentation.
4. **Commit** — commit only the intended files on the feature branch using the convention above. Keep secrets, `.env` files, credentials, build output, generated output, and local state out of commits.
5. **Integrate** — fast-forward merge the feature branch into local `development`, delete the local feature branch, and verify the result. Do not push as part of local delivery.
6. **Verify** — report the checks run and final `git status`. Make clear that local-only commits are not backed up remotely.

Preserve unrelated working-tree changes throughout.

## Promotion flow

Promotions are deliberate; do not promote automatically after feature work.

1. **Development to staging** — when staging validation is requested, ensure `development` is verified, then fast-forward `staging` from `development`. Run the relevant validation on `staging` and report the result.
2. **Staging to main** — only when a release is requested and staging has passed validation, fast-forward `main` from `staging`. Verify the final branch and report what was promoted.
3. Leave the working tree on `development` after a promotion. Do not push promoted branches unless remote delivery was explicitly requested.

If a promotion cannot fast-forward, stop and report the divergence; do not reset or rewrite branch history to force it.

## Remote loop (only when explicitly requested)

Use this repository's configured issue tracker and review process when applicable; do not assume a shared project board or create work items in an external tracker without being asked.

1. Sync `development` with its remote using fast-forward-only updates, then create an intent-specific feature branch.
2. Implement and verify the change; commit only intended files.
3. Push the feature branch and open a reviewed PR targeting `development`, linked to its issue when there is one. Never push directly to `development`, `staging`, or `main`.
4. Wait for required CI and review; do not merge with failing checks.
5. Merge only after approval, preserving individual commits with a merge commit. Close any linked issue after verification.
6. Promote through reviewed PRs in order: `development` to `staging`, then validated `staging` to `main`. Do not skip a branch or merge an unvalidated promotion.
7. Delete the remote and local feature branch, fetch/prune, and fast-forward local branches where possible. Leave the working tree on `development`.

If an issue, review, CI check, merge, or sync is blocked, report it instead of treating delivery as complete. Local-only commits are not backed up remotely.

## Local service lifecycle

- Before starting or restarting a local service, inspect its port and stop duplicate processes first.
- Stop every service started or restarted for the task before finishing. Confirm ports are free with `lsof -nP -iTCP:<port> -sTCP:LISTEN`; if a root process owns several services, stop that root process and verify all child ports are released.
- Do not kill unrelated user processes. If a listener cannot be safely identified or stopped, report it.
