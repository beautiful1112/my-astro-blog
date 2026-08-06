# Path vector and policy

Distance-vector protocols advertise a distance; link-state protocols advertise topology; BGP advertises reachable NLRI plus a vector of path attributes.

AS_PATH is central but not the only decision input. LOCAL_PREF can express outbound policy, MED can suggest an inbound entry point to a neighboring AS, communities classify routes, and import/export policy can accept, reject, or transform advertisements.

The same UPDATE can be accepted and preferred by one router, accepted but non-best on another, or rejected entirely by a third. That behavior is a feature: policy is local.

---

