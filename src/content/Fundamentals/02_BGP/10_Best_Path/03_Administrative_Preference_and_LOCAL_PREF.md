# Administrative Preference and LOCAL_PREF

Some platforms expose a local-only attribute such as **weight** before LOCAL_PREF. It affects a single router and is not a standard BGP attribute.

LOCAL_PREF, by contrast, is propagated through iBGP and expresses AS-wide exit preference. This leads to a useful hierarchy:

- Use local-only weight sparingly for device-specific exceptions.
- Use LOCAL_PREF for consistent AS-wide intent.
- Use IGP cost for closest-exit behavior only after higher policy criteria tie.

A local weight override can make two routers in the same AS choose different exits, complicating troubleshooting and failure tests. If the intent should survive the failure of one edge router, encode it in shared policy rather than an undocumented local exception.

---

