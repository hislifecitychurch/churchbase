# Product and delivery workflow

## Issue lifecycle

### Plan and shape

- Do not monitor GitHub in the background. When the user asks what to build next, inspect open issues, the project, relevant code, and recorded product decisions. Recommend up to three evidence-backed candidates, including dependencies, risks, and unresolved decisions.
- Propose issue or project changes before making them. Create, edit, prioritize, or link GitHub work items only when the user selects the work or asks for those changes.
- Before implementation, make the issue actionable: state the goal, scope, acceptance criteria, dependencies, and how it will be verified. Resolve product, authorization, or sensitive-data decisions before building.
- Use a parent issue for an outcome and sub-issues for independently deliverable slices. Do not create sub-issues for every implementation step; each child should have a clear result that can be reviewed on its own.
- Set the native GitHub issue Type to **Task**, **Bug**, or **Feature**. Do not add a duplicate type label; use labels only for recurring cross-cutting needs. Current repository labels are documented in [`.docs/issues/labels.md`](../.docs/issues/labels.md).
- Set Priority and Size only when the available information supports a useful choice.

### Issue format

- Use the matching form in `.github/ISSUE_TEMPLATE/`. When creating issues as an agent, follow the same form and set the native issue Type.
- Titles are concise, sentence case, and have no type prefix or trailing period. Feature and Task titles state the action and outcome; Bug titles describe the observed failure.
- Feature descriptions capture the user problem, desired outcome, scope, acceptance criteria, and dependencies or open questions. Task descriptions capture the goal, deliverables, acceptance criteria, and dependencies. Bug descriptions capture actual and expected behavior, reproduction steps, impact/context, and how the fix will be verified.

### Project status

- **Backlog** — Captured work that is not yet prioritized.
- **Todo** — Scoped, selected, and ready to start.
- **In progress** — Implementation is underway.
- **In review** — Implementation is ready for human review.
- **Testing** — Review is complete and validation is underway.
- **Done** — Accepted, validated, and delivered.
- **Cancelled** — Stopped or out of scope.
- **Archived** — Historical work that is no longer actionable.

When the user asks to build a tracked issue, move it to **In progress**. When implementation is ready for review, move it to **In review** and report the changes, checks, limitations, and local commit. Move it to **Testing** or **Done**, or close it, only when the corresponding validation, acceptance, and delivery are complete. A local-only commit is not shared delivery; do not mark a remote issue **Done** solely because code was committed locally.

## Code delivery

### Branch model

- `development` is the integration branch. Start feature work from it; do not work directly on it.
- `staging` is the pre-release validation branch. Promote to it from `development` when staging validation is requested.
- `main` is the stable release branch. Promote to it from validated `staging` only when a release is requested.
- Use one intent-specific local branch per change, such as `feat/<name>`, `fix/<name>`, or `chore/<name>`.
- Keep work local by default. Do not push, open pull requests, or publish a release unless the user explicitly requests remote delivery.

### Commit message convention

For commits linked to a GitHub issue, use `(#<number>) <type>(<scope>): <imperative summary>`, for example `(#4) feat(api): add authorized church creation`. For commits without a linked issue, use `<type>(<scope>): <imperative summary>`. Omit an unnecessary scope. Use a concise subject, followed by a blank line and `-` bullets describing what changed and why. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`. For breaking changes, append `!` and include a `BREAKING CHANGE:` footer.

The `(#number)` prefix is a Churchbase convention outside the standard Conventional Commit header; any commit parser must strip or explicitly allow it. Pull-request titles remain Conventional Commits without the issue prefix. For reviewed PR merges, preserve individual commits with a merge commit rather than squashing them.

### Local loop (default)

Run this loop for retained work:

1. **Inspect** — check the selected issue, if any, the branch, and the working tree. Preserve unrelated changes; never reset, discard, overwrite, or stage them. If they prevent safe work, stop and report it.
2. **Branch** — start from local `development` and create one intent-specific branch. If a matching remote `development` exists, fast-forward from it first; do not try to pull a remote branch that does not exist.
3. **Implement** — read applicable instructions, make the smallest complete change, and run the narrowest relevant checks. Use the package manager and scripts declared by the root configuration. Before changing Turborepo configuration or commands, follow the Turborepo-specific guidance in `AGENTS.md` and the installed package's documentation.
4. **Commit** — commit only the intended files on the feature branch using the convention above. Keep secrets, `.env` files, credentials, build output, generated output, and local state out of commits.
5. **Integrate** — fast-forward merge the feature branch into local `development`, delete the local feature branch, and verify the result. Do not push as part of local delivery.
6. **Report** — state the checks run, local commit, issue status, and final `git status`. Make clear that local-only commits are not backed up remotely.

Preserve unrelated working-tree changes throughout.

### Remote loop (only when explicitly requested)

Use the repository's configured issue tracker and review process when applicable. Follow the issue lifecycle above; do not assume a shared project board or create additional work items without user approval.

1. Sync `development` with its remote using fast-forward-only updates, then create an intent-specific feature branch.
2. Implement and verify the selected issue; commit only intended files.
3. Push the feature branch and open a reviewed PR targeting `development`, linked to its issue when there is one. Never push directly to `development`, `staging`, or `main`.
4. Wait for required CI and review; do not merge with failing checks.
5. Merge only after approval, preserving individual commits with a merge commit. Close any linked issue after verification and delivery.
6. Delete the remote and local feature branch, fetch/prune, and fast-forward local branches where possible. Leave the working tree on `development`.

If an issue, review, CI check, merge, or sync is blocked, report it instead of treating delivery as complete. Local-only commits are not backed up remotely.

### Promotions

Promotions are deliberate; do not promote automatically after feature work.

1. **Development to staging** — only when staging validation is requested and `development` is verified. For local delivery, fast-forward `staging` from `development`; for remote delivery, use a reviewed PR. Run the relevant validation on `staging` and report the result.
2. **Staging to main** — only when a release is requested and staging has passed validation. For local delivery, fast-forward `main` from `staging`; for remote delivery, use a reviewed PR.
3. Do not push promoted branches unless remote delivery was explicitly requested. Leave the working tree on `development` after a local promotion.

If a promotion cannot fast-forward, stop and report the divergence; do not reset or rewrite branch history to force it.

### Local service lifecycle

- Before starting or restarting a local service, inspect its port and stop duplicate processes first.
- Stop every service started or restarted for the task before finishing. Confirm ports are free with `lsof -nP -iTCP:<port> -sTCP:LISTEN`; if a root process owns several services, stop that root process and verify all child ports are released.
- Do not kill unrelated user processes. If a listener cannot be safely identified or stopped, report it.
