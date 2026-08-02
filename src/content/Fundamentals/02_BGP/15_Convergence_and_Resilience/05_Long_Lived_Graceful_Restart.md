# Long-Lived Graceful Restart

Long-Lived Graceful Restart (LLGR) permits selected stale routes to remain beyond the ordinary graceful-restart interval. Special communities signal stale status and scope.

This can help during long control-plane maintenance when forwarding truly remains intact. It can also prolong blackholes dramatically when that assumption is false.

Use LLGR only for address families and peers with a justified forwarding-survival model. Apply lower preference to stale paths where appropriate, cap stale time, and test complete node and transport failures—not only planned process restarts.

LLGR is a continuity mechanism, not a substitute for redundant paths.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
