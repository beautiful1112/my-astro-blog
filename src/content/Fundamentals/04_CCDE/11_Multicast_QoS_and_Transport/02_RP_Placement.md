# RP placement

For ASM, the RP is a **control-plane meeting point**, not the data-plane hairpin for every packet (once SPT is in play). Place it for **reachability, HA, and domain bounds**.

- Anycast RP + MSDP (or equivalent) for HA
- Do not put the only RP at a spoke
- Interdomain: MSDP/hierarchy; do not accidentally merge multicast domains
- Bidir and SSM change the RP story (SSM: no RP)

## Interview framing

“RP is a control meeting point with anycast HA, sitting where every receiver domain can reach it—not a random core loopback without a domain plan.”

---
