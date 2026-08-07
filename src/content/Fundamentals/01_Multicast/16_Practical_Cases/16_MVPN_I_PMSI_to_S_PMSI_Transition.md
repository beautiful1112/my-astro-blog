# Case 16: MVPN I-PMSI to S-PMSI transition loses packets

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Symptom

A customer `(C-S,C-G)` flow works at low rate through the inclusive PMSI. When it crosses the provider's selective-tree threshold, receivers see a short gap. BGP MVPN routes eventually look correct.

## Expected make-before-break

1. ingress PE advertises Type 3 S-PMSI A-D binding;
2. receiver PEs import it and instantiate/join the selective P-tunnel;
3. Type 4 Leaf A-D responses arrive if required;
4. label/tunnel and VRF state is programmed;
5. ingress PE sends on S-PMSI;
6. I-PMSI copy is removed after the selective path is ready.

## Failure mechanism

The ingress PE stops the I-PMSI copy before one receiver PE completes provider-tunnel or label programming. BGP route presence precedes data-plane readiness.

The opposite ordering can create duplicates if both PMSIs deliver simultaneously and egress duplicate suppression is absent.

## Investigation

Correlate:

- threshold decision timestamp;
- Type 3 advertisement/import;
- Leaf A-D response;
- P-tunnel/LSP leaf operational state;
- label and VRF MFIB programming;
- final I-PMSI packet and first S-PMSI packet by sequence.

Check whether only one PE lags, suggesting a local tunnel/ASIC issue, or every PE gaps, suggesting ingress transition logic.

## Fix and validation

Adjust supported make-before-break/readiness behavior, repair tunnel signaling, or change the selective threshold/profile. Test transition in both directions and during a provider-path failure.

## Lesson

BGP signaling convergence is not identical to PMSI data-plane readiness. Measure the binding, tunnel, label, and packet sequence as separate events.
