# BGP learning objectives

These objectives define “done” for a serious BGP study path. Use them as a checklist before interviews or production ownership. Linked modules below are the primary study homes; later modules deepen each item.

## Protocol core

You should be able to:

- explain BGP as a **policy-driven path-vector** protocol, not a shortest-path IGP ([What BGP is](../02_Fundamentals/01_What_BGP_Is.md), [Path vector and policy](../02_Fundamentals/03_Path_Vector_and_Policy.md));
- separate control-plane learning from data-plane forwarding ([Control plane versus data plane](../02_Fundamentals/04_Control_Plane_vs_Data_Plane.md));
- use precise terminology: AS, ASN, NLRI, speaker/peer, AFI/SAFI, Loc-RIB vs FIB ([Core terminology](../02_Fundamentals/05_Core_Terminology.md));
- contrast eBGP and iBGP defaults for ASN prepend, NEXT_HOP, and split horizon ([eBGP versus iBGP](../03_ASNs_and_Peering/02_eBGP_vs_iBGP.md));
- describe ASN space, four-octet interop (`AS_TRANS`, `AS4_PATH`), and private-AS hygiene ([AS number space](../03_ASNs_and_Peering/01_AS_Number_Space.md), [Private ASNs](../03_ASNs_and_Peering/04_Private_ASNs_and_Remove_Private_AS.md)).

## Sessions, FSM, and messages

You should be able to:

- explain why BGP rides TCP/179 and what that does *not* guarantee ([TCP 179](../04_Sessions_and_Transport/01_TCP_179.md));
- configure and diagnose direct vs multihop eBGP, update-source/loopbacks, passive mode, and collision handling (module 04);
- narrate the FSM from Idle to Established and interpret Active correctly ([FSM](../05_FSM_and_Timers/01_Finite_State_Machine.md));
- negotiate Hold/Keepalive, reason about ConnectRetry/backoff, and decode NOTIFICATION codes (module 05);
- decode OPEN, UPDATE, KEEPALIVE, NOTIFICATION, and Route Refresh; explain capability negotiation and treat-as-withdraw (module 06).

## RIBs, attributes, and selection

You should be able to:

- distinguish Adj-RIB-In, Loc-RIB, Adj-RIB-Out and map them to vendor CLI ([Three RIBs](../07_RIBs_and_Updates/01_Three_Conceptual_RIBs.md));
- explain NLRI identity vs longest-prefix match in the FIB ([NLRI and LPM](../07_RIBs_and_Updates/02_NLRI_and_Longest_Prefix_Match.md));
- reason about advertisement, withdrawal, replacement, and next-hop resolution (module 07);
- interpret attribute categories/flags, core path attributes, and **AIGP** (module 08, [AIGP](../08_Path_Attributes/11_AIGP.md));
- predict eligibility, best path, installation, and advertisement as separate stages (module 10).

## Policy, scale, security, and ops

You should be able to:

- design safe customer / provider / peer / internal policies and valley-free export ([Peering relationships](../03_ASNs_and_Peering/03_Peering_Types_and_Relationships.md), later policy modules);
- explain iBGP full mesh, route reflection, path hiding, and ADD-PATH;
- apply advanced PE-CE / session knobs with correct scoping: **allowas-in**, **as-override**, **SoO**, **local-as**, **next-hop-unchanged**, ORF, and conditional advertisement (modules 11–12, 18);
- use MP-BGP for IPv6, labeled unicast, VPN, EVPN, and other AFI/SAFIs;
- reason about BFD, graceful restart, PIC, and graceful shutdown;
- apply prefix filters, AS-path filters, communities, RPKI, max-prefix, GTSM, and leak controls;
- design resilient, latency-aware BGP for trading-style connectivity;
- troubleshoot missing routes, inactive routes, asymmetry, churn, and leaks from evidence.

## Self-check format

For each objective, demand three artifacts:

1. A one-sentence definition accurate enough for an interview.
2. A lab or packet/CLI proof you have actually seen.
3. One failure mode and how you would detect it.

If you can only recite the sentence, the objective is not met.

## Interview framing

“My BGP bar is: explain the wire and FSM, map RIBs to CLI, predict accept/select/install/advertise, and defend policy and security choices with evidence—not with slogans.”

---
