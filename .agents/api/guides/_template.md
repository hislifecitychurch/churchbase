# <Feature> guide

<!-- Copy this file when documenting stable feature behavior. Remove this comment and replace the placeholders. -->

## Purpose and scope

Describe what product behavior this guide governs and what it does not cover.

## Status

- **Implemented:** behavior and routes that exist today.
- **Present but not exposed:** supporting code or schema that is not part of a public workflow.
- **Planned:** behavior that is not an API contract yet.

Keep this section factual; do not describe planned behavior as implemented.

## Source of truth

Identify which server-side records and policies are authoritative, and what clients may display or submit.

## Business rules and invariants

Document vocabulary, ownership, valid values, authorization, and facts that must remain true.

## Implemented flows and API contract

For each implemented operation, document the path, input/output, authentication, authorization, side effects, status codes, and rejection cases. Label proposed paths as candidates until implemented.

## Lifecycle and architecture

Describe state transitions and the feature's route → handler → service → repository ownership. List only concrete files an agent should inspect.

## Future work and tests

List prerequisites and unresolved product decisions. Map business rules, authorization failures, invalid input, dependency failures, and transaction behavior to tests.
