# Route Accepted but Not Best

Display all paths and compare them in the platform's actual decision order:

- Local weight or administrative class.
- LOCAL_PREF.
- Local origination.
- AS_PATH.
- ORIGIN.
- MED scope.
- eBGP/iBGP status.
- IGP metric to next hop.
- RR and final tie-breakers.

Check whether the expected path is actually eligible. An unresolved next hop or RPKI rejection is not a normal best-path loss.

Record the first criterion that differs; later attributes are irrelevant.

---

