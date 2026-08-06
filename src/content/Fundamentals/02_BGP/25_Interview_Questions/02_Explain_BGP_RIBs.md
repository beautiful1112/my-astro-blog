# Interview: Explain the Three BGP RIBs

## Question

Explain Adj-RIB-In, Loc-RIB, and Adj-RIB-Out.

## Strong answer

Adj-RIB-In represents routes received from a peer before local selection; implementations may expose pre- and post-policy variants. Loc-RIB contains locally selected routes after policy and the decision process. Adj-RIB-Out represents routes selected and transformed for one peer after export policy. They are conceptual structures, not necessarily three physical copies.

## Follow-up

Trace a missing route as received → accepted → best → installed → advertised.

---

