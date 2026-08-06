# Interview: LOCAL_PREF vs MED

## Question

Compare LOCAL_PREF and MED.

## Strong answer

LOCAL_PREF is an AS-internal exit preference: higher wins, it is distributed through iBGP, and it is normally not sent to eBGP peers. MED is an inbound hint sent to a neighboring AS: lower normally wins and, by default, it is usually compared only among paths from the same neighboring AS. LOCAL_PREF commonly appears earlier in best-path selection and is under the receiving AS's authority.

---

