# Stub and NSSA as design tools

Stub-like areas **reduce external LSA load** and force a default from the ABR. They are query/LSDB tools, not “less important sites.”

| Area type | External LSAs | Typical use |
|---|---|---|
| Normal | Type-5 flood | Transit, where ASBRs live |
| Stub | No type-5; default | Campus/WAN spoke with no ASBR |
| Totally stubby | No type-5/3 (except default) | Maximum hiding |
| NSSA | Type-7 local redistributon | Spoke that must inject a few externals |
| Totally NSSA | NSSA + no type-3 | Same with max hiding |

Use them when the **requirement** is a small LSDB and a default is enough. Do not stub a transit area that must carry specific externals.

## Interview framing

“Stub/NSSA are how I stop type-5 from eating a spoke LSDB. I pick NSSA only if that area must originate a limited external.”

---
