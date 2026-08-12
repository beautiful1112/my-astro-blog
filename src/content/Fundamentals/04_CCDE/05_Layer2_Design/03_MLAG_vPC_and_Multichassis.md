# MLAG, vPC, and multichassis

Multichassis LAG (vPC, MLAG, stacking/VSS-like pairs) makes two boxes look like one L2 neighbor so **both uplinks forward** without STP blocking.

## What you buy

- Active-active uplinks from access or servers
- Simpler STP topology (loop-free from the downstream view)
- Maintenance of one peer with (hopefully) surviving forwarding

## What you still share

The pair is a **fate domain**: peer-link, keepalive, inconsistent VLANs, and “split brain.” A vPC that stretches across rooms on a skinny peer-link is a new SPOF with extra steps.

```text
Access
  |    \
  |     \  port-channel
 Dist-A ==peer== Dist-B
```

Design peer-link for **worst-case flooding** if the downstream hashing fails, and keep keepalive on a **different** path than the peer-link.

## Versus stacking

Stacking/chassis virtualization is stronger coupling (one control plane). Multichassis LAG is usually a **looser** pair. Pick from ops skill and failure model, not brand names.

## Interview framing

“MLAG/vPC is how I keep L2 dual-active without STP blocking—but the pair is still one failure domain, so I do not stretch it across buildings for sport.”

---
