# Data sovereignty and governance

Sovereignty is **where data may live and who may process it**. Governance is **who decides, logs, and is accountable**. Cloud and AI make this a first-class network design input.

## Design questions

1. Which data classes exist (public, internal, PII, regulated, model weights)?
2. Which regions/countries are allowed for each class?
3. Public, private, or hybrid—and is “hybrid” a control plane, a data plane, or both?
4. Who holds keys (customer-managed vs provider)?
5. What is logged, where logs live, and how long?

A Direct Connect into a foreign region can violate a residency requirement even if latency is excellent.

## Typical constraints

| Constraint | Network response |
|---|---|
| EU personal data stays in EU | Pin regions, inspect SaaS destinations, careful DNS/CDN |
| Logs are evidence | In-region logging plane, immutable store, separate admin path |
| Public cloud forbidden for a class | Private DC or dedicated region + encryption story |
| Acquisition in another country | Do not casually merge identity and logging planes |

## Hybrid is not a free pass

Hybrid often means **split-brain governance**: some workloads in cloud, crown jewels on-prem. The network must make the split **enforceable** (segmentation, policy points), not just connected.

## Interview framing

“I treat residency and key custody as constraints as hard as MTU. Connectivity that lands data in the wrong jurisdiction is a failed design, not a fast one.”

---
