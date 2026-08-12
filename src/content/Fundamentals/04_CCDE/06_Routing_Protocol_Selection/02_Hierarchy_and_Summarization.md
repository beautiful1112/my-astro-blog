# Hierarchy and summarization

Hierarchy is how you keep **SPF/query/LSDB/RIB** inside human and CPU limits. Summarization is how you **hide topology** at a module boundary.

## Without hierarchy

```text
200 routers, 1 area, messy addresses
  -> large LSDB, noisy SPF, huge blast radius
```

## With hierarchy

```text
Region summaries at ABRs / distribution / RR
  Core carries few aggregates
  Failure in region A does not recompute the world
```

Addressing must **enable** summarization. You cannot summarize what you did not allocate contiguously. See [summarizable plans](../12_IPv6_and_Addressing/04_Summarizable_Address_Plans.md).

## Costs of summarization

- Suboptimal routing (traffic takes the summary, not the more-specific)
- Blackholes if the summary is advertised without a discard/null route
- Hiding a better exit (sometimes you **want** that for stability)

CCDE: summarization is a **tool with side effects**, not a moral good. Place it where the requirement is stability/scale, and leak specifics only with a reason.

## Interview framing

“Hierarchy is a failure-domain and scale tool. I summarize only where the address plan allows, and I accept or leak suboptimal paths deliberately.”

---
