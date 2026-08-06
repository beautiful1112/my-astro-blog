# IGMPv3 Group Record types

The Record Type tells the router whether the record describes **current state** or a **state change**.

| Value | Name | Category | Meaning of listed sources |
|---:|---|---|---|
| 1 | MODE_IS_INCLUDE | Current state | Sources currently requested |
| 2 | MODE_IS_EXCLUDE | Current state | Sources currently excluded |
| 3 | CHANGE_TO_INCLUDE_MODE | Mode change | New INCLUDE list |
| 4 | CHANGE_TO_EXCLUDE_MODE | Mode change | New EXCLUDE list |
| 5 | ALLOW_NEW_SOURCES | Source-list change | Sources newly wanted |
| 6 | BLOCK_OLD_SOURCES | Source-list change | Sources no longer wanted |

## Current-state records

These are normally sent in response to a Query:

- **MODE_IS_INCLUDE {S1,S2}:** receive G from S1 and S2.
- **MODE_IS_EXCLUDE {S3}:** receive G from every source except S3.

## State-change records

These are sent immediately after interface state changes and retransmitted according to the Robustness Variable:

- **CHANGE_TO_EXCLUDE_MODE {}** commonly represents a new ASM-style join.
- **CHANGE_TO_INCLUDE_MODE {}** commonly represents leaving all sources.
- **ALLOW_NEW_SOURCES {S2}** adds S2 in INCLUDE mode or removes S2 from an EXCLUDE block list.
- **BLOCK_OLD_SOURCES {S1}** removes S1 in INCLUDE mode or adds S1 to an EXCLUDE block list.

The names ALLOW and BLOCK describe the traffic effect, not a simple set-add or set-delete operation. Their set operation depends on the current filter mode.

## Transition table

| Old interface state | New state | Record generated |
|---|---|---|
| INCLUDE(A) | INCLUDE(B) | ALLOW(B − A), BLOCK(A − B) |
| EXCLUDE(A) | EXCLUDE(B) | ALLOW(A − B), BLOCK(B − A) |
| INCLUDE(A) | EXCLUDE(B) | CHANGE_TO_EXCLUDE_MODE(B) |
| EXCLUDE(A) | INCLUDE(B) | CHANGE_TO_INCLUDE_MODE(B) |

Empty ALLOW/BLOCK records are omitted.

Primary reference: [RFC 3376, Sections 4.2.12 and 5.1](https://www.rfc-editor.org/rfc/rfc3376.html#section-4.2.12).

