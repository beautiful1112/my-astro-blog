# Five Route Views

For one prefix, distinguish:

| View | Question |
|---|---|
| Received | Did the peer send it? |
| Accepted | Did import policy retain it? |
| Best | Did it win BGP selection? |
| Installed | Did it enter the main RIB and FIB? |
| Advertised | Did export policy send it to this neighbor? |

A route can pass one stage and fail the next. Examples:

- Received but rejected by prefix policy.
- Accepted but not best.
- Best but not installed because another protocol has lower administrative distance.
- Installed but not exportable under iBGP split horizon.
- Export candidate but blocked by outbound policy.

Use these terms precisely in incident notes.

---

