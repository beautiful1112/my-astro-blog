# Risk, reward, and continuity

Business continuity is a **risk budget**. The network either concentrates risk or spreads it.

## Continuity questions

1. What event are we designing against (site, region, provider, control-plane, human error)?
2. What is the maximum tolerable outage (RTO) and data loss (RPO)?
3. What is the residual risk after the design (and is it accepted)?

```text
Threat: metro fiber cut
Mitigation: diverse entrance + second provider
Residual: both providers in same conduit (must verify)
```

If you cannot name residual risk, you sold a slogan.

## Risk/reward

Over-engineering a low-value site wastes money that could buy real diversity for the revenue site. Under-engineering the identity plane (NAC/IdP) can take the whole campus down “securely.”

Reward is not only uptime: faster merger, faster branch open, ability to use SaaS. A slightly less “pretty” IGP that enables a 90-day acquisition can be the right design.

## Design patterns

| Continuity goal | Typical network move |
|---|---|
| Site survives WAN loss | Local Internet + cached/SaaS breakout + critical on-prem apps |
| Company survives DC loss | Dual DC, independent control, tested failover, DNS/GSLB |
| Company survives vendor loss | Avoid single-cloud or single-controller lock-in where constraint says so |
| Company survives bad change | Automation with rollback, change windows matched to risk |

## Interview framing

“Continuity is an explicit risk budget: I name the event, the RTO, the mechanism, and the residual risk I am asking the business to accept.”

---
